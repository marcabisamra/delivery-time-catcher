const INSTACART_PATH = "/store/checkout_v3";
const INSTACART_ELT_NAME = "delivery_option";
const PRIMENOW_ELT_NAME = "delivery-window-radio";
const PRIMENOW_PATH = "/checkout/enter-checkout";
const CHECK_TIMES_INTERVAL = 12000;
let foundDeliveryTimes = false;
let checkForTimesInterval;

window.addEventListener('load', function () {
  chrome.storage.sync.get('isEnabled', function (data) {
    checkForTimesInterval = window.setInterval(checkForTimes, CHECK_TIMES_INTERVAL);
  });
  window.onblur = function() {
    //stop checkout pages from hiding the DOM when you leave the tab
  };
});

function checkForTimes() {
  if (foundDeliveryTimes ) return;
  if (window.location.pathname === INSTACART_PATH) {
    checkForTimeslotElts(INSTACART_ELT_NAME);
  } else if (window.location.pathname === PRIMENOW_PATH) {
    checkForTimeslotElts(PRIMENOW_ELT_NAME);
  }
}

function checkForTimeslotElts(eltName) {
  const deliveryOpts = document.getElementsByName(eltName);
  if (deliveryOpts.length > 0) {
    foundTimesAction();
  } else {
    didntFindTimesAction()
  }
}

function didntFindTimesAction() {
  console.log('No delivery times available');
  window.location.reload();
}

function foundTimesAction() {
  foundDeliveryTimes = true;
  window.clearInterval(checkForTimes);
  checkForTimesInterval = null;
  const audioElt = document.createElement('audio');
  audioElt.src = chrome.runtime.getURL('/assets/Fairuz - El Bent El Shalabiah.mp3');
  audioElt.onloadedmetadata = function () {
    chrome.runtime.sendMessage({ foundDeliveryTimes: true }, function ()  {
      audioElt.play();
    });
  };
}