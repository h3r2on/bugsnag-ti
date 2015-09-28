/**
 * @package bugsnag-ti
 * @author Joel Herron
 * @email herronj@gmail.com
 * @version 0.1
 * @license http://apache Apache 2.0 licnense
 * 
 */


var Logger = require("yy.logcatcher");
var apiKey;
var releaseStage = 'production';
var autonotify = true;
var useSSL = true;
var notifier_info = {
		name: "Bugsnag Titanium",
		version: "1.0.0",
	    url: "https://github.com/h3r2on/bugsnag-ti"
};
var currentUser;

// automatically catch TiExceptions
Logger.addEventListener('error', function(_e){
	
	exports.notify(_e);
});

exports.register = function(_apiKey, _args){
	apiKey = _apiKey;
	
	if (_args.user) {
		currentUser = _args.user;
	}

	if(_args.releaseStage) {
		releaseStage = _args.releaseStage;
	}
};

exports.notify = function(_args){
	if(releaseStage != 'development') {
		
		var payload = {
		    apiKey: apiKey,
		    notifier:  notifier_info,   
		    events: [{
		        payloadVersion: "2",
		        exceptions: [{
		            errorClass: _args.type,
		            message: _args.message,
		            stacktrace: [{
      			        file: _args.sourceURL,
        				lineNumber: _args.line,
				        columnNumber: (_args.column) ? _args.column : null,
				        method: "APP"
    				}],
		        }],
		        severity: _args.type,
		        app: {
		          version: Ti.App.version,
		          releaseStage: releaseStage,
		        },
		        device: {
		          osVersion: Ti.Platform.manufacturer +' '+ Ti.Platform.model + ' ('+ Ti.Platform.osname + ' OS version: ' + Ti.Platform.version +')',
		          hostname: (Ti.App.Properties.hasProperty('API_URL')) ? Ti.App.Properties.getString('API_URL') : null
		        },
		        metaData: {
		        	stack_trace: (_args.stack) ? _args.stack : ""
		        }
		    }]
		};
		if (currentUser) {
			payload.events[0].user = currentUser;
		}

		sendToBugSnag(payload);
	}
};

/**
 * Send the bug report to the server
 * @param  {JSON} _payload the bug payload
 * @return {null}          no return
 */
function sendToBugSnag(_payload) {
	var request = Ti.Network.createHTTPClient({
		timeout: 5000,
		onload: function(_e){
			// no action just log it out
			console.log(_e);
		},

		onerror: function(_e) {
			// no action just log it
			console.error(_e);
		}
	});

	request.open("POST", "https://notify.bugsnag.com");
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify(_payload));
}