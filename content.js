// コメント非表示の切り替え
function toggleComments(hide) {
    const commentsSection = document.querySelector(
        "ytd-item-section-renderer#sections"
    );
    if (commentsSection) {
        commentsSection.style.display = hide ? "none" : "";
    }
}

// toggleの変更
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "toggleComments") {
        toggleComments(request.hide);
    }
});

// DOMの変更を監視
const observerCallback = (mutationsList, observer) => {
    chrome.storage.sync.get(["commentsHidden"], function (result) {
        const hideComments = result.commentsHidden || false;
        for (const mutation of mutationsList) {
            if (
                mutation.type === "childList" &&
                mutation.addedNodes.length > 0
            ) {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.matches("ytd-item-section-renderer#sections")
                    ) {
                        toggleComments(hideComments);
                    }
                });
            }
        }
    });
};

const observerOptions = {
    childList: true,
    subtree: true,
};

const observer = new MutationObserver(observerCallback);
observer.observe(document.body, observerOptions);
