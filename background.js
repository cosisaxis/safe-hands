chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "studyTimeStart") {
    chrome.storage.sync.get(["blockedWebsites"], function (result) {
      const blockedWebsites = result.blockedWebsites || [];

      chrome.action.setBadgeText({ text: "ON" });

      chrome.scripting.executeScript({
        target: { tabId: -1 },
        function: blockWebsites,
        args: [blockedWebsites]
      });
    });
  } else if (alarm.name === "studyTimeEnd") {
    chrome.action.setBadgeText({ text: "" });

    chrome.scripting.executeScript({
      target: { tabId: -1 },
      function: unblockWebsites
    });
  }
});

function blockWebsites(blockedWebsites) {
  chrome.scripting.insertCSS({
    target: { cssOrigin: "user" },
    files: ["blocker.css"]
  });

  chrome.webNavigation.onBeforeNavigate.addListener(
    function (details) {
      const url = new URL(details.url);
      if (blockedWebsites.includes(url.hostname)) {
        chrome.scripting.insertCSS({
          target: { tabId: details.tabId },
          files: ["blocker.css"]
        });

        chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          function: function () {
            document.documentElement.innerHTML = "<h1>This website is blocked during your study/work session.</h1>";
          }
        });

        // Send text message using Twilio
        sendTextMessage(url.hostname);
      }
    },
    { url: [{ schemes: ["http", "https"] }] }
  );
}

function unblockWebsites() {
  chrome.webNavigation.onBeforeNavigate.removeListener();

  chrome.scripting.removeCSS({
    target: { cssOrigin: "user" },
    files: ["blocker.css"]
  });
}

function sendTextMessage(website) {
  const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
  const authToken = "YOUR_TWILIO_AUTH_TOKEN";
  const twilioPhoneNumber = "YOUR_TWILIO_PHONE_NUMBER";
  const recipientPhoneNumber = "RECIPIENT_PHONE_NUMBER";

  const client = require("twilio")(accountSid, authToken);

  const messageBody = `Blocked website visited: ${website}`;

  client.messages.create({
    body: messageBody,
    from: twilioPhoneNumber,
    to: recipientPhoneNumber
  })
  .then((message) => console.log("Text message sent:", message.sid))
  .catch((error) => console.error("Error sending text message:", error));
}
