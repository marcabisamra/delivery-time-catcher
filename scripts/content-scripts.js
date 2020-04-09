const INSTACART_PATH = "/store/checkout_v3";
const INSTACART_ELT_NAME = "delivery_option";
const PRIMENOW_ELT_NAME = "delivery-window-radio";
const PRIMENOW_PATH = "/checkout/enter-checkout";
const SONG_URL = chrome.runtime.getURL('/assets/Fairuz - El Bent El Shalabiah.mp3');
const CHECK_TIMES_INTERVAL = 12000;
let foundDeliveryTimes = false;
let checkForTimesInterval;

window.addEventListener('load', function () {
  chrome.runtime.sendMessage({ foundDeliveryTimes: false });
  checkForTimesInterval = window.setInterval(checkForTimes, CHECK_TIMES_INTERVAL);
});

function checkForTimes() {
  chrome.storage.sync.get('isEnabled', function (data) {
    if (foundDeliveryTimes || !data.isEnabled) return;
    if (window.location.pathname === INSTACART_PATH) {
      checkForTimeslotElts(INSTACART_ELT_NAME);
    } else if (window.location.pathname === PRIMENOW_PATH) {
      checkForTimeslotElts(PRIMENOW_ELT_NAME);
    }
  });
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
  chrome.runtime.sendMessage({ foundDeliveryTimes: false }, function () {
    window.location.reload();
  });
}

function foundTimesAction() {
  foundDeliveryTimes = true;
  window.clearInterval(checkForTimes);
  checkForTimesInterval = null;
  const audioElt = document.createElement('audio');
  audioElt.src = SONG_URL;
  audioElt.onloadedmetadata = function () {
    chrome.runtime.sendMessage({ foundDeliveryTimes: true }, () => {
      audioElt.play();
    });
  };
}