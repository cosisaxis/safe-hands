chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "studyTimeStart") {
    chrome.storage.sync.get(["blockedWebsites"], function (result) {
      const blockedWebsites = result.blockedWebsites || [];

      chrome.webRequest.onBeforeRequest.addListener(
        blockRequestListener,
        { urls: blockedWebsites },
        ["blocking"]
      );
    });
  } else if (alarm.name === "studyTimeEnd") {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequestListener);
  }
});

function blockRequestListener(details) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "Blocked Website",
    message: "You are trying to access a blocked website.",
  });

  sendTextToAccountabilityPartner(details.url);
}

function sendTextToAccountabilityPartner(url) {
  const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
  const authToken = "YOUR_TWILIO_AUTH_TOKEN";
  const fromNumber = "YOUR_TWILIO_PHONE_NUMBER";
  const toNumber = "YOUR_ACCOUNTABILITY_PARTNER_PHONE_NUMBER";

  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: `You visited a blocked website: ${url}`,
      from: fromNumber,
      to: toNumber,
    })
    .then((message) => console.log(message.sid));
}
