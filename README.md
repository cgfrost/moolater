# Moo Later &nbsp;&nbsp;[![Build Status](https://travis-ci.org/cgfrost/moolater.svg?branch=master)](https://travis-ci.org/cgfrost/moolater) [![dependencies Status](https://david-dm.org/cgfrost/moolater/status.png?theme=shields.io)](https://david-dm.org/cgfrost/moolater#info=dependencies) [![devDependencies Status](https://david-dm.org/cgfrost/moolater/dev-status.png?theme=shields.io)](https://david-dm.org/cgfrost/moolater#info=devDependencies)

<p align="center">
  <img src="data/logo/icon-128.png?raw=true" alt="Moo Later Logo" height="64" width="64"/>
</p>

Firefox extension for quickly saving a task to [Remember The Milk](https://www.rememberthemilk.com/) from the tool bar. The title and link of the current page are used to create the new task. The first version is being reviewed by Mozilla and is in the Firefox [Add-Ons marketplace](https://addons.mozilla.org/en-US/firefox/addon/moo-later/). Using Moo Later is easy: Login, check the details then add it.
<p align="center">
	<img src="screenshots/step-1.png?raw=true" alt="Moo Later Logo" width="205"/>
	<img src="screenshots/step-2.png?raw=true" alt="Moo Later Logo" width="205"/>
	<img src="screenshots/step-3.png?raw=true" alt="Moo Later Logo" width="205"/>
</p>

# Hotkeys

On Windows/Linux `Control + Shift + M` will open Moo Later.
On Mac `Command + Shift + M` will open Moo Later.

# Settings

This extension can be configured through the Firefox Add-ons preferences page. This is accessed by clicking the menu items `Tools -> Add-ons`. Then select `Extensions` from the side menu and click the `Preferences` button for Moo Later. 

* Default List - The name of the list that will be selected automatically for new tasks. It must match the name of an existing list with the same capitalization. New tasks can not be added to Smart Lists. Default is empty which will go to the Inbox. I recommend using a separate list for Moo Later created tasks, perhaps called `Read Later`.
* Use Title - Use the title of the currently viewed page for new tasks. Default is checked.
* Use Address - Use the url of the currently viewed page for new tasks. Default is checked.
* Use Smart Add - Should the new tasks title be processed by Remember the Milk [Smart Add](https://www.rememberthemilk.com/help/?ctx=basics.smartadd.whatis). Default is checked.
 
When entering a new task the Address must be a valid URL that starts with `http://` or `https://`. To save a task with no Address the link field can be left empty. 

# Future Features

Once version 1.0.0 is approved I plan on adding the following.

* Remorse option to remove the previously added task.
* The ability to create new lists straight from the Moo Later UI.
* A context menu option so a section of text from a webpage can be added to a task as a detailed description or note.
* Look at support for tags but I may leave that to `smart add` for users to specify instead of any direct support.
* Firefox Android, see what's involved and if it's actually useful.

There is no timeline for when these might get done as I work on this in my spare time. It also depends on how many bugs people find in 1.0.0.

# Attribution
This product uses the Remember The Milk API but is not endorsed or certified by Remember The Milk.
