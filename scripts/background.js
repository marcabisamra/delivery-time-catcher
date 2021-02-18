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
          playSong()
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

function beep() {
  const context = new AudioContext();

//defaults to A440Hz, sine wave
  const src = context.createOscillator();

// Now let's create a modulator to turn beeps on and off
  const mod = context.createOscillator();
  mod.type="square";
  mod.frequency.value = "2";  // Start at 2Hz

  const gain = context.createGain();
  const scaler = context.createGain();

  src.connect(gain);
  gain.connect(context.destination);

  mod.connect(scaler); // Mod signal is [-1,1]
  scaler.gain.value = 0.5; // we need it to be [-0.5,0.5]
  gain.gain.value = 0.5; // then it's summed with 0.5, so [0,1]
  scaler.connect(gain.gain);

//start it up
  src.start(0);
  mod.start(0);

// to change rate, change mod.frequency.value to desired frequency
}

function playSong(){
  const audioElt = document.createElement('audio');
  audioElt.src = chrome.runtime.getURL('/assets/Fairuz - El Bent El Shalabiah.mp3');
  audioElt.onloadedmetadata = function () {
    audioElt.play();
  };
}