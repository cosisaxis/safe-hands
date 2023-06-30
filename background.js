function sendSMS(phoneNumber) {
  const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
  const authToken = "YOUR_TWILIO_AUTH_TOKEN";
  const twilioPhoneNumber = "YOUR_TWILIO_PHONE_NUMBER";

  const body =
    "Your friend visited one of the sites they shouldn't be visiting.";
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const params = {
    body,
    from: twilioPhoneNumber,
    to: phoneNumber,
  };

  const headers = {
    Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  fetch(url, {
    method: "POST",
    headers,
    body: new URLSearchParams(params),
  })
    .then((response) => response.json())
    .then((data) => console.log("SMS sent:", data.sid))
    .catch((error) => console.error("Error sending SMS:", error));
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: [] });
});

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: ["blockRule"],
});

chrome.storage.onChanged.addListener(({ blockedSites }) => {
  if (blockedSites && blockedSites.newValue) {
    const rule = {
      id: "blockRule",
      priority: 1,
      action: {
        type: "block",
      },
      condition: {
        urlFilter: {
          domains: blockedSites.newValue,
        },
      },
    };

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [rule],
    });
  }
});

chrome.webNavigation.onCommitted.addListener(({ url }) => {
  chrome.storage.sync.get(["blockedSites"], ({ blockedSites }) => {
    if (blockedSites && blockedSites.length > 0) {
      const visitedBlockedSite = blockedSites.some((site) =>
        url.includes(site)
      );

      if (visitedBlockedSite) {
        chrome.storage.sync.get(
          ["friendPhoneNumber"],
          ({ friendPhoneNumber }) => {
            if (friendPhoneNumber) {
              sendSMS(friendPhoneNumber);
            }
          }
        );
      }
    }
  });
});

chrome.storage.sync.get(
  ["blockedSites", "friendPhoneNumber"],
  ({ blockedSites, friendPhoneNumber }) => {
    if (blockedSites) {
      const rule = {
        id: "blockRule",
        priority: 1,
        action: {
          type: "block",
        },
        condition: {
          urlFilter: {
            domains: blockedSites,
          },
        },
      };

      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [rule],
      });
    }

    if (friendPhoneNumber) {
      sendSMS(friendPhoneNumber);
    }
  }
);
