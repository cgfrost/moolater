# Moo Later &nbsp;&nbsp;[![Build Status](https://travis-ci.org/cgfrost/moolater.svg?branch=master)](https://travis-ci.org/cgfrost/moolater) 

<!---
[![dependencies Status](https://david-dm.org/cgfrost/moolater/status.png?theme=shields.io)](https://david-dm.org/cgfrost/moolater#info=dependencies) [![devDependencies Status](https://david-dm.org/cgfrost/moolater/dev-status.png?theme=shields.io)](https://david-dm.org/cgfrost/moolater#info=devDependencies)
--->

<p align="center">
  <img src="src/icons/icon-128.png?raw=true" alt="Moo Later Logo" height="64" width="64"/>
</p>

Firefox extension for quickly saving a webpage as a task to [Remember The Milk](https://www.rememberthemilk.com/) from the tool bar. The title and link of the current page are used to create the new task. Create new lists from Moo Later before saving a new task to it. Find it in the Firefox [Add-ons marketplace](https://addons.mozilla.org/en-US/firefox/addon/moo-later/). Using Moo Later is easy: log in, check the details then start adding tasks.
<p align="center">
	<img src="screenshots/step-1.png?raw=true" alt="Moo Later Logo" width="205"/>
	<img src="screenshots/step-2.png?raw=true" alt="Moo Later Logo" width="205"/>
	<img src="screenshots/step-3.png?raw=true" alt="Moo Later Logo" width="205"/>
	<img src="screenshots/step-4.png?raw=true" alt="Moo Later Logo" width="205"/>
</p>

# Comments

Version 2 of Moo Later is a complete rewrite that supports Firefox version 57 and above. For versions of Firefox before this please stay with Moo Later 1.2.

If you have a bug please raise it here on GitHub but for discussion and ideas head on over to the Remember the Milk [Forums](https://www.rememberthemilk.com/forums/tips/20401/). You can also leave a review on the Firefox [Add-ons marketplace](https://addons.mozilla.org/en-US/firefox/addon/moo-later/) page.

# Hotkeys

* On Linux/Mac/Windows `Alt + M` will open Moo Later.

# Settings

This extension can be configured through the Firefox Add-ons Manager page. This is accessed by clicking the menu items `Tools -> Add-ons`. Then select `Extensions` from the side menu and click the `Preferences` button for Moo Later. 

* Default List - The name of the list that will be selected automatically for new tasks. It must match the name of an existing list with the same capitalization. New tasks can not be added to Smart Lists. Default is empty which will go to the Inbox. I recommend using a separate list for Moo Later created tasks, perhaps called `Read Later`.
* Use Title - Use the title of the currently viewed page for new tasks. Default is checked.
* Use Address - Use the URL of the currently viewed page for new tasks. Default is checked.
* Use Smart Add - Should the new task's title be processed by Remember the Milk [Smart Add](https://www.rememberthemilk.com/help/?ctx=basics.smartadd.whatis)? Default is checked.
 
When entering a new task the address must be a valid URL that starts with `http://` or `https://`. To save a task with no address the link field can be left empty.

# Development

## Initial setup

1. Install Node.js and npm.
1. Run `npm install` to install dependencies.

## Building

To build the extension, run:

```bash
npm run build
```

## Developing

To create a development instance of Firefox with Moo Later installed, run:

```bash
npm run develop
```

This does not depend on it having been built; it will use the `src` files as is.

# Attribution

This product uses the Remember The Milk API but is not endorsed or certified by Remember The Milk.
