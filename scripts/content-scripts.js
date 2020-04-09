var instacartPath = "/store/checkout_v3";
var primenowPath = "/checkout/enter-checkout";
var foundDeliveryTimes = false;
var CHECK_TIMES_INTERVAL = 12000;

window.addEventListener('load', function () {
  chrome.runtime.sendMessage({ foundDeliveryTimes: false });
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

function didntFindTimesAction(){
  console.log('No delivery times available');
  chrome.runtime.sendMessage({ foundDeliveryTimes: false }, () => {
    window.location.reload();
  });
}

function checkForTimesOnInstacart() {
  var deliveryOpts = document.getElementsByName("delivery_option");
  if (deliveryOpts.length > 0) {
    foundTimesAction();
  } else {
    didntFindTimesAction()
  }
}

function checkForTimesOnPrimeNow() {
  var deliveryOpts = document.getElementsByName("delivery-window-radio");
  if (deliveryOpts) {
    foundTimesAction();
  } else {
    didntFindTimesAction();
  }
}

function foundTimesAction() {
  foundDeliveryTimes = true;
  window.clearInterval(checkForTimes)
  var songUrl = chrome.runtime.getURL('/assets/Fairuz - El Bent El Shalabiah.mp3');
  var audioElt = document.createElement('audio');
  audioElt.src = songUrl;
  audioElt.onloadedmetadata = function () {
    chrome.runtime.sendMessage({ foundDeliveryTimes: true }, () => {
      audioElt.play();
    });
  };
}

// var doesntHaveTimes = findEltByText('span', 'Non delivery windows available. New windows are released throughout the day.');
//
// function findEltByText(tag, text) {
//   var tags = document.getElementsByTagName(tag);
//   var isFound = false;
//
//   for (var i = 0; i < tags.length; i++) {
//     if (tags[i].textContent.trim() === text) {
//       isFound = true;
//       break;
//     }
//   }
//   return isFound;
// }
