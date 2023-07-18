document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('settings-form');
  form.addEventListener('submit', saveSettings);
});

function saveSettings(event) {
  event.preventDefault();
  
  var bannedSites = document.getElementById('banned-sites').value;
  var sessionDuration = document.getElementById('session-duration').value;
  var friendEmail = document.getElementById('friend-email').value;
  
  var settings = {
    bannedSites: bannedSites,
    sessionDuration: sessionDuration,
    friendEmail: friendEmail
  };

  chrome.storage.sync.set({ settings: settings }, function() {
    console.log('Settings saved successfully');
  });
}
