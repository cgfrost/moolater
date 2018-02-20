# Skipjaq - Loda Recorda

<p align="center">
  <img src="src/icons/skipjaq_logo.png?raw=true" alt="Skipjaq Logo" height="64"/>
</p>

Firefox and Chrome extension for recording a web session as a load model to [Skipjaq](http://skipjaq.com/) from the tool bar. Find it in the Firefox [Add-Ons marketplace](https://addons.mozilla.org/en-US/firefox/addon/skipjaq-recorda/).

# Hotkeys

* On Linux/Mac/Windows `Alt + S` will open the Skipjaq recorder.

# Settings

This extension can be configured through the Firefox Add-ons preferences page. This is accessed by clicking the menu items `Tools -> Add-ons`. Then select `Extensions` from the side menu and click the `Preferences` button for Skipjaq Recorda. 

# Building

Install the latest LTS version of NodeJS. Then:

```bash
npm install --global web-ext
web-ext --overwrite-dest -s src -a target build
```

The `build.sh` script will do this for you and also produce an xpi file for uploading to Firefox.

# Running locally

Make sure `web-ext` is installed as described in the Building section above.

The `run.sh` script can be used to create a development instance of Firefox with the Skipjaq Recorda installed. This does not depend on it having been built, it will use the src files as is.

To do this with an IntelliJ run configuration, set this env variable. The `USER` home directory and Node `VERSION` will need to be set.

```
PATH=/home/USER/.nvm/versions/node/VERSION/bin:/usr/bin
```

The work directory should be set to the project root.

For Chrome, open `chrome://extensions`, enable developer mode and select to install an unpacked extension, use the src directory.
