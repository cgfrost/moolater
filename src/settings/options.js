/* global addon:false, browser: false */

(function () {
    'use strict';

    window.browser = (function () {
        return window.browser || window.chrome;
    })();

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
            defaultList: document.getElementById('skipjaq-default').value,
            // useTitle: document.getElementById('skipjaq-useTitle').checked,
            // useLink: document.getElementById('skipjaq-useLink').checked,
            // useSmartAdd: document.getElementById('skipjaq-useSmartAdd').checked,
            // showContextMenu: document.getElementById('skipjaq-showContextMenu').checked
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

        // let booleanOption = (option) => {
        //     return option === undefined ? true : option === true;
        // };

        browser.storage.local.get().then((settings) => {
            document.getElementById('skipjaq-defaultList').value = settings.defaultList || 'Read Later';
            // document.getElementById('skipjaq-useTitle').checked = booleanOption(settings.useTitle);
            // document.getElementById('skipjaq-useLink').checked = booleanOption(settings.useLink);
            // document.getElementById('skipjaq-useSmartAdd').checked = booleanOption(settings.useSmartAdd);
            // document.getElementById('skipjaq-showContextMenu').checked = booleanOption(settings.showContextMenu);
        }).catch((error) => {
            console.log(`Settings error: ${error.message}`);
        });
    }

    document.addEventListener('DOMContentLoaded', setup);
    document.querySelector('form').addEventListener('submit', saveOptions);

}());