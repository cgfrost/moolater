function saveOptions(e) {
    browser.storage.local.set({
        defaultList: document.querySelector("#moolater-defaultList").value
    });
    browser.storage.local.set({
        useTitle: document.querySelector("#moolater-useTitle").value
    });
    browser.storage.local.set({
        useLink: document.querySelector("#moolater-useLink").value
    });
    browser.storage.local.set({
        useSmartAdd: document.querySelector("#moolater-useSmartAdd").value
    });
    browser.storage.local.set({
        showContextMenu: document.querySelector("#moolater-showContextMenu").value
    });
}

function restoreOptions() {
    browser.storage.local.get("moolater-defaultList", (res) => {
        document.querySelector("#moolater-defaultList").value = res.defaultList || "Read Later";
    });
    browser.storage.local.get("moolater-useTitle", (res) => {
        document.querySelector("#moolater-useTitle").value = res.useTitle || true;
    });
    browser.storage.local.get("moolater-useLink", (res) => {
        document.querySelector("#moolater-useLink").value = res.useLink || true;
    });
    browser.storage.local.get("moolater-useSmartAdd", (res) => {
        document.querySelector("#moolater-useSmartAdd").value = res.useSmartAdd || true;
    });
    browser.storage.local.get("moolater-showContextMenu", (res) => {
        document.querySelector("#moolater-showContextMenu").value = res.showContextMenu || true;
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
