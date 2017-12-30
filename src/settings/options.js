/* global addon:false, browser: false */

(function () {
    'use strict';

    function onError(error) {
        console.log(`Settings error: ${error}`);
    }

    function saveOptions(e) {
        e.preventDefault();
        let settings = {
            defaultList: document.querySelector("#moolater-defaultList").value,
            useTitle: document.querySelector("#moolater-useTitle").checked,
            useLink: document.querySelector("#moolater-useLink").checked,
            useSmartAdd: document.querySelector("#moolater-useSmartAdd").checked,
            showContextMenu: document.querySelector("#moolater-showContextMenu").checked
        };

        browser.storage.local.set(settings).then(null, onError);
    }

    function restoreOptions() {
        browser.storage.local.get().then((settings) => {
            document.querySelector("#moolater-defaultList").value = settings.defaultList || "Read Later";
            document.querySelector("#moolater-useTitle").checked = settings.useTitle || true;
            document.querySelector("#moolater-useLink").checked = settings.useLink || true;
            document.querySelector("#moolater-useSmartAdd").checked = settings.useSmartAdd || true;
            document.querySelector("#moolater-showContextMenu").checked = settings.showContextMenu || true;
        }, onError);
    }

    document.addEventListener("DOMContentLoaded", restoreOptions);
    document.querySelector("form").addEventListener("submit", saveOptions);

}());