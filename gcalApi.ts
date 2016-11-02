declare var gapi: any;

class GoogleCalendarAPI {

	constructor() {
		chrome.identity.getAuthToken({ 'interactive': true }, function () {
	    	// console.log(chrome.runtime.lastError, token);
		    //load Google's javascript client libraries
		    window.gapi_onload = this.authorize();
		    this.loadScript('https://apis.google.com/js/client.js');
	  	});
	}

	loadScript(url: string): void {
		console.log("Entered loadScript");
	    var request: XMLHttpRequest = new XMLHttpRequest();
	    request.onreadystatechange = function () {
	        if (request.readyState !== 4) {
	            return;
	        }
	        if (request.status !== 200) {
	            return;
	        }
	        eval(request.responseText);
	    };
	    request.open('GET', url);
	    request.send();
	}

	authorize(): void {
		console.log("Entered authorize");
	    gapi.auth.authorize({
	        client_id: '955471480917-os9ckb90t4pr092sg6ulpg1ogjmpr5ot.apps.googleusercontent.com',
	        immediate: true,
	        scope: 'https://www.googleapis.com/auth/calendar'
	    }, function () {
	        gapi.client.load('calendar', 'v3');
	        // console.log("Anonymous function");
	    });
	}
}