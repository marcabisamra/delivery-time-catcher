chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({isEnabled: true}, function() {
    console.log("Extension enabled");
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.foundDeliveryTimes) {
      chrome.windows.update(sender.tab.windowId, { focused: true }, function() {
        chrome.tabs.update(sender.tab.id, { 'active': true }, function () {
          console.log('Updated window and tab');
        });
      });
    }
  });