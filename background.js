function sendSMS(phoneNumber) {
  const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
  const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
  const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

  const body = 'Your friend visited one of the sites they shouldn\'t be visiting.';
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const params = {
    body,
    from: twilioPhoneNumber,
    to: phoneNumber
  };

  const headers = {
    'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  fetch(url, {
    method: 'POST',
    headers,
    body: new URLSearchParams(params)
  })
    .then(response => response.json())
    .then(data => console.log('SMS sent:', data.sid))
    .catch(error => console.error('Error sending SMS:', error));
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: [], startTime: '', endTime: '', friendPhoneNumber: '' });
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
  chrome.storage.sync.get(['blockedSites', 'friendPhoneNumber', 'startTime', 'endTime'], ({ blockedSites, friendPhoneNumber, startTime, endTime }) => {
    if (blockedSites && blockedSites.length > 0) {
      const visitedBlockedSite = blockedSites.some(site => url.includes(site));
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const startTimeArray = startTime.split(':');
      const startHour = parseInt(startTimeArray[0]);
      const startMinute = parseInt(startTimeArray[1]);
      const endTimeArray = endTime.split(':');
      const endHour = parseInt(endTimeArray[0]);
      const endMinute = parseInt(endTimeArray[1]);

      if (visitedBlockedSite && currentHour >= startHour && currentHour < endHour) {
        if (
          (currentHour === startHour && currentMinute >= startMinute) ||
          (currentHour === endHour - 1 && currentMinute < endMinute) ||
          (currentHour > startHour && currentHour < endHour - 1)
        ) {
          if (friendPhoneNumber) {
            sendSMS(friendPhoneNumber);
          }
        }
      }
    }
  });
});

