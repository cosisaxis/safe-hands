chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    const blocklist = await getBlocklist();

    const url = new URL(tab.url);
    if (blocklist.includes(url.hostname)) {
      sendNotification();
    }
  }
});

async function getBlocklist() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("blocklist", (result) => {
      const blocklist = result.blocklist || [];
      resolve(blocklist);
    });
  });
}

function sendNotification() {
  const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
  const authToken = "YOUR_TWILIO_AUTH_TOKEN";
  const client = twilio(accountSid, authToken);

  const phoneNumber = "YOUR_FRIENDS_PHONE_NUMBER";
  const message = "You are wasting time! Focus on your work!";

  client.messages
    .create({
      body: message,
      from: "YOUR_TWILIO_PHONE_NUMBER",
      to: phoneNumber
    })
    .then(message => console.log("Notification sent!"))
    .catch(error => console.error(error));
}
