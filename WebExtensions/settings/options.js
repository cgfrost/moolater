function saveOptions(e) {
    chrome.storage.local.set({
        defaultList: document.querySelector("#moolater-defaultList").value
    });
    chrome.storage.local.set({
        useTitle: document.querySelector("#moolater-useTitle").value
    });
    chrome.storage.local.set({
        useLink: document.querySelector("#moolater-useLink").value
    });
    chrome.storage.local.set({
        useSmartAdd: document.querySelector("#moolater-useSmartAdd").value
    });
    chrome.storage.local.set({
        showContextMenu: document.querySelector("#moolater-showContextMenu").value
    });
}

function restoreOptions() {
    chrome.storage.local.get("moolater-defaultList", (res) => {
        document.querySelector("#moolater-defaultList").value = res.defaultList || "Read Later";
    });
    chrome.storage.local.get("moolater-useTitle", (res) => {
        document.querySelector("#moolater-useTitle").value = res.useTitle || true;
    });
    chrome.storage.local.get("moolater-useLink", (res) => {
        document.querySelector("#moolater-useLink").value = res.useLink || true;
    });
    chrome.storage.local.get("moolater-useSmartAdd", (res) => {
        document.querySelector("#moolater-useSmartAdd").value = res.useSmartAdd || true;
    });
    chrome.storage.local.get("moolater-showContextMenu", (res) => {
        document.querySelector("#moolater-showContextMenu").value = res.showContextMenu || true;
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
