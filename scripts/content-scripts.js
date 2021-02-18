const INSTACART_PATH = "/store/checkout_v3";
const INSTACART_ELT_NAME = "delivery_option";
const PRIMENOW_ELT_NAME = "delivery-window-radio";
const TURBO_VAX_PATH = "/";
const TURBO_VAX_ELT_NAME = "a.MuiButton-containedPrimary:not(.Mui-disabled)";
const PRIMENOW_PATH = "/checkout/enter-checkout";
const CHECK_TIMES_INTERVAL = 2000;
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
  if (foundDeliveryTimes) return;
  if (window.location.pathname === INSTACART_PATH) {
    checkForTimeslotElts(INSTACART_ELT_NAME);
  } else if (window.location.pathname === PRIMENOW_PATH) {
    checkForTimeslotElts(PRIMENOW_ELT_NAME);
  }else if (window.location.pathname === TURBO_VAX_PATH) {
    checkForTimeslotElts(TURBO_VAX_ELT_NAME, true);
  }
}

function checkForTimeslotElts(eltName, shouldUseQuerySelector) {
  let deliveryOpts
  if (shouldUseQuerySelector) {
    deliveryOpts = document.querySelectorAll(eltName);
  } else {
    deliveryOpts = document.getElementsByName(eltName);
  }
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
  chrome.runtime.sendMessage({ foundDeliveryTimes: true });
}
