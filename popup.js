document.addEventListener("DOMContentLoaded", function () {
  var addSiteButton = document.getElementById("addSite");
  addSiteButton.addEventListener("click", function () {
    var siteInput = document.getElementById("siteInput").value;
    if (siteInput) {
      chrome.storage.sync.get("blockedSites", function (data) {
        var blockedSites = data.blockedSites || [];
        blockedSites.push(siteInput);
        chrome.storage.sync.set({ blockedSites: blockedSites });
        updateBlockedList();
      });
      document.getElementById("siteInput").value = "";
    }
  });

  function updateBlockedList() {
    chrome.storage.sync.get("blockedSites", function (data) {
      var blockedSites = data.blockedSites || [];
      var blockedList = document.getElementById("blockedList");
      blockedList.innerHTML = "";
      blockedSites.forEach(function (site) {
        var li = document.createElement("li");
        li.textContent = site;

        // Add remove button
        var removeButton = document.createElement("button");
        removeButton.textContent = "x";
        removeButton.id = "b_x";
        removeButton.addEventListener("click", function () {
          chrome.storage.sync.get("blockedSites", function (data) {
            var blockedSites = data.blockedSites;
            var index = blockedSites.indexOf(site);
            if (index !== -1) {
              blockedSites.splice(index, 1);
              chrome.storage.sync.set({ blockedSites: blockedSites });
              updateBlockedList();
            }
          });
        });

        // Add suspend button
        var suspendButton = document.createElement("button");
        suspendButton.textContent = "20 s";
        suspendButton.id = "b_frei";
        suspendButton.addEventListener("click", function () {
          chrome.storage.sync.get("blockedSites", function (data) {
            var blockedSites = data.blockedSites;
            var index = blockedSites.indexOf(site);
            if (index !== -1) {
              // Temporarily remove the site
              blockedSites.splice(index, 1);
              chrome.storage.sync.set({ blockedSites: blockedSites });
              updateBlockedList();

              // After 1 minute, add the site back
              setTimeout(function () {
                blockedSites.push(site);
                chrome.storage.sync.set({ blockedSites: blockedSites });
                updateBlockedList();
              }, 10000); // 10000 milliseconds = 20 s
            }
          });
        });

        li.appendChild(removeButton);
        li.appendChild(suspendButton);

        blockedList.appendChild(li);
      });
    });
  }

  updateBlockedList();
});
