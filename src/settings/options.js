/* global addon:false, browser: false */

(function () {
    'use strict';

    let statusIcon = document.getElementById('status-img');

    function flashIconState(icon, iconName) {
        setIconState(icon, iconName);
        setTimeout(() => {
            setIconState(icon, 'blank');
        }, 1000);
    }

    function setIconState(icon, iconName) {
        icon.setAttribute('src', '../images/' + iconName + '.svg');
    }

    function saveOptions(e) {
        e.preventDefault();
        setIconState(statusIcon, 'loading');
        let settings = {
            defaultList: document.querySelector("#moolater-defaultList").value,
            useTitle: document.querySelector("#moolater-useTitle").checked,
            useLink: document.querySelector("#moolater-useLink").checked,
            useSmartAdd: document.querySelector("#moolater-useSmartAdd").checked,
            showContextMenu: document.querySelector("#moolater-showContextMenu").checked
        };
        browser.storage.local.set(settings).then(() => {
            flashIconState(statusIcon, 'done');
        }).catch((error) => {
            flashIconState(statusIcon, 'error');
        });
    }

    function restoreOptions() {
        setIconState(statusIcon, 'blank');
        browser.storage.local.get().then((settings) => {
            document.querySelector("#moolater-defaultList").value = settings.defaultList || "Read Later";
            document.querySelector("#moolater-useTitle").checked = settings.useTitle || true;
            document.querySelector("#moolater-useLink").checked = settings.useLink || true;
            document.querySelector("#moolater-useSmartAdd").checked = settings.useSmartAdd || true;
            document.querySelector("#moolater-showContextMenu").checked = settings.showContextMenu || true;
        }).catch((error) => {
            console.log(`Settings error: ${error.message}`);
        });
    }

    document.addEventListener("DOMContentLoaded", restoreOptions);
    document.querySelector("form").addEventListener("submit", saveOptions);

}());