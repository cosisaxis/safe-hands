document.addEventListener("DOMContentLoaded", function () {
    const websiteInput = document.getElementById("websiteInput");
    const addWebsiteButton = document.getElementById("addWebsiteButton");
    const blockedWebsitesList = document.getElementById("blockedWebsitesList");
  
    addWebsiteButton.addEventListener("click", function () {
      const website = websiteInput.value.trim();
      if (website) {
        chrome.storage.sync.get("blocklist", function (result) {
          const blocklist = result.blocklist || [];
          blocklist.push(website);
          chrome.storage.sync.set({ blocklist }, function () {
            addBlockedWebsiteToList(website);
            websiteInput.value = "";
          });
        });
      }
    });
  
    chrome.storage.sync.get("blocklist", function (result) {
      const blocklist = result.blocklist || [];
      blocklist.forEach(function (website) {
        addBlockedWebsiteToList(website);
      });
    });
  
    function addBlockedWebsiteToList(website) {
      const listItem = document.createElement("li");
      listItem.textContent = website;
      
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", function () {
        removeBlockedWebsite(website);
        listItem.remove();
      });
      
      listItem.appendChild(removeButton);
      blockedWebsitesList.appendChild(listItem);
    }
    
    function removeBlockedWebsite(website) {
      chrome.storage.sync.get("blocklist", function (result) {
        const blocklist = result.blocklist || [];
        const updatedBlocklist = blocklist.filter(item => item !== website);
        chrome.storage.sync.set({ blocklist: updatedBlocklist });
      });
    }
    
  });
  