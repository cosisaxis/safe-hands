chrome.webNavigation.onCompleted.addListener(function(details) {
  chrome.storage.sync.get('settings', function(data) {
    var settings = data.settings;
    if (!settings) return;
  
    var bannedSites = settings.bannedSites.split(',');
    var sessionDuration = parseInt(settings.sessionDuration);
    var friendEmail = settings.friendEmail;
  
    var url = new URL(details.url);
    if (bannedSites.includes(url.hostname)) {
      sendEmail(friendEmail, "They're visiting a banned site: " + url.href);
    }
  });
});

function sendEmail(to, message) {
  var subject = "Banned Site Notification";
  var body = message;

  // Send email using Gmail API
  gapi.client.init({
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    scope: 'https://www.googleapis.com/auth/gmail.send'
  }).then(function() {
    return gapi.client.gmail.users.messages.send({
      'userId': 'me',
      'resource': {
        'raw': base64UrlEncode(createEmail(to, 'me', subject, body))
      }
    });
  }).then(function(response) {
    console.log('Email sent successfully');
  }, function(error) {
    console.error('Error sending email:', error);
  });
}

function createEmail(to, from, subject, message) {
  var email = "From: " + from + "\r\n";
  email += "To: " + to + "\r\n";
  email += "Subject: " + subject + "\r\n";
  email += "\r\n" + message + "\r\n";
  var encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');
  return encodedEmail;
}

function base64UrlEncode(str) {
  var base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
