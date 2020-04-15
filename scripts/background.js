chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ isEnabled: true }, function() {
    console.log("Extension enabled");
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.foundDeliveryTimes === true) {
      chrome.windows.update(sender.tab.windowId, { focused: true }, function() {
        chrome.tabs.update(sender.tab.id, {active: true}, function () {
          console.log('Updated window and tab');
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '../assets/icon128.png',
            title: 'Time to check out!',
            message: 'Delivery times are now available'
          });
        });
      });
   } else if (request.foundDeliveryTimes === false) {
     console.log('No times found');
   }
    sendResponse(true);
  });