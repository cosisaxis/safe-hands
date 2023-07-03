document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.addEventListener('click', saveSettings);
  restoreSettings();
});

function saveSettings() {
  const blockedSitesInput = document.getElementById('blockedSites');
  const friendPhoneNumberInput = document.getElementById('friendPhoneNumber');
  const startTimeInput = document.getElementById('startTime');
  const endTimeInput = document.getElementById('endTime');

  const blockedSites = blockedSitesInput.value
    .split(',')
    .map(site => site.trim())
    .filter(site => site.length > 0);

  const friendPhoneNumber = friendPhoneNumberInput.value.trim();
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  chrome.storage.sync.set({
    blockedSites,
    friendPhoneNumber,
    startTime,
    endTime
  }, () => {
    alert('Settings saved!');
  });
}

function restoreSettings() {
  chrome.storage.sync.get(['blockedSites', 'friendPhoneNumber', 'startTime', 'endTime'], ({ blockedSites, friendPhoneNumber, startTime, endTime }) => {
    if (blockedSites) {
      const blockedSitesInput = document.getElementById('blockedSites');
      blockedSitesInput.value = blockedSites.join(', ');
    }

    if (friendPhoneNumber) {
      const friendPhoneNumberInput = document.getElementById('friendPhoneNumber');
      friendPhoneNumberInput.value = friendPhoneNumber;
    }

    if (startTime) {
      const startTimeInput = document.getElementById('startTime');
      startTimeInput.value = startTime;
    }

    if (endTime) {
      const endTimeInput = document.getElementById('endTime');
      endTimeInput.value = endTime;
    }
  });
}


