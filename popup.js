document.addEventListener("DOMContentLoaded", function () {
    const switchElement = document.getElementById("switch1");

    chrome.storage.sync.get(["commentsHidden"], function (result) {
        switchElement.checked = result.commentsHidden || false;
    });

    switchElement.addEventListener("change", function () {
        const hideComments = switchElement.checked;
        chrome.storage.sync.set({ commentsHidden: hideComments }, function () {
            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(function (tab) {
                    if (tab.url && tab.url.includes("youtube.com")) {
                        chrome.tabs.sendMessage(tab.id, {
                            action: "toggleComments",
                            hide: hideComments,
                        });
                    }
                });
            });
        });
    });
});
