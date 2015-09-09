[![Build Status](https://travis-ci.org/cgfrost/moolater.svg?branch=master)](https://travis-ci.org/cgfrost/moolater)
# Moo Later
<p align="center">
  <img src="data/logo/icon-128.png?raw=true" alt="Moo Later Logo" height="64" width="64"/>
</p>
Firefox extension for quickly saving a task to [Remember The Milk](https://www.rememberthemilk.com/) from the tool bar. It populates the URL field of the task in RTM with the current URL. In the settings panel you can choose to have the title of the page entered as the task description. When a first version is ready it will be published in the Firefox [Add-Ons marketplace](https://addons.mozilla.org/en-US/firefox/extensions/).

# Settings

This extension can be configured through the Firefox Add-ons preferences page. This is accessed by clicking the menu items `Tools -> Add-ons`. Then select `Extensions` from the side menu and click the `Preferences` button for Moo Later. By default Moo Later will use the title and url of the currently viewed page for a new task. Unchecking the boxes will turn this off. When entering a new task the Link must be a valid URL that starts with `http://` or `https://`. To save a task with no link the Link field can be left empty. The name of the list that will be selected automatically for new tasks can also be set in the preferences and must match the name of an existing list with the same capitalization. New tasks can not be added to Smart Lists.

# Future Features

After releasing version 1.0.0 with a decent set of initial features I plan on adding the following.

* Remorse option to remove the previously added task.
* The ability to create new lists straight from the Moo Later UI.
* A context menu option so a section of text from a webpage can be added to a task as a detailed description or note.
* Look at support for tags but I may leave that to `smart add` for users to specify instead of any direct support.
* Firefox Android, see what's involved and if it's actually useful.

There is no timeline for when these might get done as I work on this in my spare time. It also depends on how many bugs people find in 1.0.0.

# Attribution
This product uses the Remember The Milk API but is not endorsed or certified by Remember The Milk.
