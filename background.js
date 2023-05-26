// Event listener for web requests
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      const url = details.url;
      if (shouldBlock(url)) {
        sendEmail("Your friend's email", "Blocked Site Notification", "You visited a blocked website: " + url);
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
  
  // Function to check if the URL should be blocked
  function shouldBlock(url) {
    const blockedSites = JSON.parse(localStorage.getItem("blockedSites")) || [];
    return blockedSites.includes(url);
  }
  
  // Function to send an email using EmailJS
  function sendEmail(toEmail, subject, body) {
    Email.send({
      SecureToken: "your_emailjs_secure_token",
      To: toEmail,
      From: "your_emailjs_registered_email",
      Subject: subject,
      Body: body
    }).then(
      message => console.log("Email sent successfully:", message)
    ).catch(
      error => console.error("Error sending email:", error)
    );
  }
  