/* global addon:false, browser: false */

(function () {
    'use strict';

    const ANDROID = 'android';
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
            defaultList: document.getElementById('moolater-defaultList').value,
            useTitle: document.getElementById('moolater-useTitle').checked,
            useLink: document.getElementById('moolater-useLink').checked,
            useSmartAdd: document.getElementById('moolater-useSmartAdd').checked,
            showContextMenu: document.getElementById('moolater-showContextMenu').checked
        };
        browser.storage.local.set(settings).then(() => {
            flashIconState(statusIcon, 'done');
        }).catch((error) => {
            console.log(`Settings error: ${error.message}`);
            flashIconState(statusIcon, 'error');
        });
    }

    function setup() {
        setIconState(statusIcon, 'blank');

        let booleanOption = (option) => {
            return option === undefined ? true : option === true;
        };

        browser.runtime.getPlatformInfo().then((info) => {
            if (ANDROID === info.os) {
                document.getElementById('desktop-only').classList.add('hide');
            }
        });

        browser.storage.local.get().then((settings) => {
            document.getElementById('moolater-defaultList').value = settings.defaultList || 'Read Later';
            document.getElementById('moolater-useTitle').checked = booleanOption(settings.useTitle);
            document.getElementById('moolater-useLink').checked = booleanOption(settings.useLink);
            document.getElementById('moolater-useSmartAdd').checked = booleanOption(settings.useSmartAdd);
            document.getElementById('moolater-showContextMenu').checked = booleanOption(settings.showContextMenu);
        }).catch((error) => {
            console.log(`Settings error: ${error.message}`);
        });
    }

    document.addEventListener('DOMContentLoaded', setup);
    document.querySelector('form').addEventListener('submit', saveOptions);

}());