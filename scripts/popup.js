var toggleLabel = document.getElementById('toggle-label');
var toggleInput = document.getElementById('toggle-input');

function toggleOn() {
  console.log('Toggle on');
  toggleLabel.className = 'toggle-label';
  toggleInput.checked = true;
}

function toggleOff() {
  console.log('Toggle off');
  toggleLabel.className = 'toggle-label disabled';
  toggleInput.checked = false;
}

function toggleOnClick () {
  chrome.storage.sync.get('isEnabled', function(data) {
    const newStateIsEnabled = !data.isEnabled;
    if (newStateIsEnabled) {
      toggleOn();
    } else {
      toggleOff();
    }
    chrome.storage.sync.set({ isEnabled: newStateIsEnabled });
  });
};

toggleInput.onclick = toggleOnClick;
toggleLabel.onclick = toggleOnClick;

chrome.storage.sync.get('isEnabled', function(data) {
  if (data.isEnabled) {
    toggleOn();
  } else {
    toggleOff();
  }
});

