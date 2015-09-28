# Bugsnag-ti
A bugsnag client for Titanium mobile

This library allows you to grab any TiException that occurs in your app and sends it on you your BugSnag account.

## Installation

1. Install the [yy.logcatcher](http://gitt.io/component/yy.logcatcher) module as this does the Ti magic
2. Place the bugsnag.js file in your `app/lib` folder.


## Usage

In your `app/alloy.js` add:

    Alloy.Globals.bugsnag = require('bugsnag');
    Alloy.Globabls.bugsnag.register('YOUR_BUGSNAG_API_KEY',{'releaseStage': 'STAGE', 'user': User_Object});

The user is optional but release stage is not. Currently the library only send issues to bugsnag for `staging` and `production` release stages.

To manually trigger a error to bugsnag you can do the following.

    Alloy.Globals.notify(_args (array));

The list of available arguments:

* (string) type  		The type of error, bugsnag supports `error`, `warning` or `info`
* (string) message  	The error message
* (string) sourceURL 	The filename where the error occured
* (integer) line  		The line number.
* (integer) column 		The column number (optional)
* (string) stack 		The Stack trace for the error (optional)
