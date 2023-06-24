document.addEventListener("DOMContentLoaded", function () {
  const websitesInput = document.getElementById("websites");
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const saveButton = document.getElementById("saveBtn");

  saveButton.addEventListener("click", function () {
    const blockedWebsites = websitesInput.value.split(",").map((website) => website.trim());
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    chrome.storage.sync.set(
      {
        blockedWebsites: blockedWebsites,
        startTime: startTime,
        endTime: endTime,
      },
      function () {
        alert("Settings saved successfully!");
      }
    );
  });
});
