const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

const client = require('twilio')(accountSid, authToken);

function sendSMS(phoneNumber) {
  client.messages
    .create({
      body: 'Your friend visited one of the sites they shouldn\'t be visiting.',
      from: twilioPhoneNumber,
      to: phoneNumber
    })
    .then(message => console.log('SMS sent:', message.sid))
    .catch(error => console.error('Error sending SMS:', error));
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: [] });
});

chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ['blockRule'] });

chrome.storage.onChanged.addListener(({ blockedSites }) => {
  if (blockedSites && blockedSites.newValue) {
    const rule = {
      id: 'blockRule',
      priority: 1,
      action: {
        type: 'block'
      },
      condition: {
        urlFilter: {
          domains: blockedSites.newValue
        }
      }
    };

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [rule]
    });
  }
});

chrome.webNavigation.onCommitted.addListener(({ url }) => {
  chrome.storage.sync.get(['blockedSites'], ({ blockedSites }) => {
    if (blockedSites && blockedSites.length > 0) {
      const visitedBlockedSite = blockedSites.some(site => url.includes(site));

      if (visitedBlockedSite) {
        chrome.storage.sync.get(['friendPhoneNumber'], ({ friendPhoneNumber }) => {
          if (friendPhoneNumber) {
            sendSMS(friendPhoneNumber);
          }
        });
      }
    }
  });
});
