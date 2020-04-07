var instacartPath = "/store/checkout_v3";
var primenowPath = "/checkout/enter-checkout";
var foundDeliveryTimes = false;
var CHECK_TIMES_INTERVAL = 12000;

window.addEventListener('load', function () {
  window.setInterval(checkForTimes, CHECK_TIMES_INTERVAL);
});

function checkForTimes() {
  chrome.storage.sync.get('isEnabled', function(data) {
    if (foundDeliveryTimes || !data.isEnabled) return;
    if (window.location.pathname === instacartPath) {
      checkForTimesOnInstacart();
    } else if (window.location.pathname === primenowPath) {
      checkForTimesOnPrimeNow();
    }
  });

}

function checkForTimesOnInstacart() {
  var deliveryOpts = document.getElementsByName("delivery_option");
  if (deliveryOpts.length > 0) {
    foundTimesAction();
  } else {
    window.location.reload();
  }
}

function checkForTimesOnPrimeNow() {
  var doesntHaveTimes = findEltByText('span', 'No delivery windows available. New windows are released throughout the day.');
  if (doesntHaveTimes) {
    console.log('No delivery times available');
    window.location.reload();
  } else {
    foundTimesAction();
  }
}

function foundTimesAction() {
  var songUrl = chrome.runtime.getURL('/assets/Fairuz - El Bent El Shalabiah.mp3');
  var audioElt = document.createElement('audio');
  audioElt.src = songUrl;
  audioElt.onloadedmetadata = function () {
    chrome.runtime.sendMessage({ foundDeliveryTimes: true }, () => {
      audioElt.play();
      foundDeliveryTimes = true;
    });
  };
  window.clearInterval(checkForTimes)
}

function findEltByText(tag, text) {
  var tags = document.getElementsByTagName(tag);
  var isFound = false;

  for (var i = 0; i < tags.length; i++) {
    if (tags[i].textContent.trim() === text) {
      isFound = true;
      break;
    }
  }
  return isFound;
}
