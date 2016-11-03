declare var gapi: any;

class GoogleCalendarAPI {

	constructor() {
		chrome.identity.getAuthToken({ 'interactive': true }, function () {
	    	// console.log(chrome.runtime.lastError, token);
		    //load Google's javascript client libraries
		    window.gapi_onload = this.authorize();
		    this.loadScript('https://apis.google.com/js/client.js');
	  	});
		document.getElementById("Create").addEventListener("click", createEvents);
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
	        client_id: '223210400436-gflvl7h6pig37rgvb60o5rbkjuulqhot.apps.googleusercontent.com',
	        immediate: true,
	        scope: 'https://www.googleapis.com/auth/calendar'
	    }, function () {
	        gapi.client.load('calendar', 'v3', loadEvents);
	        // console.log("Anonymous function");
	    });
	}

	//function to load upcoming events from the user's calendar
	loadEvents(): void {
		alert("This");
		var displayRequest = gapi.client.calendar.events.list(
			{
				'calendarId': 'primary',
				'timeMin': (new Date()).toISOString(),
				'showDeleted': false,
				'singleEvents': true,
				'maxResults': 10,
				'orderBy': 'startTime'
			}
		);

		displayRequest.execute(function (resp) {
			var events = resp.items;
			if (events.length > 0) { //display next 5 events if they exist
				display('Upcoming events:');
				for (var i = 0; i < events.length && i < 5; i++) {
					var event = events[i];
					var when = event.start.dateTime;
					if (!when) {
						when = event.start.date;
					}
					display(event.summary + ' (' + when + ')')
				}
			}
			else {
				display('No upcoming events found.');
			}
		}
		);
	}

	//function to add an event to the user's calendar
	createEvents(): void {
		var event =
			{
				'summary': 'Pencil-It-In Test',
				'location': '800 Howard St., San Francisco, CA 94103',
				'description': 'Testing event creating for P-I-I app',
				'start': {
					'dateTime': '2016-10-15T09:00:00-07:00',
					'timeZone': 'America/New_York'
				},
				'end': {
					'dateTime': '2016-10-16T17:00:00-07:00',
					'timeZone': 'America/Los_Angeles'
				},
				'recurrence': [
					'RRULE:FREQ=DAILY;COUNT=2'
				],
				'attendees': [{ 'email': 'dragster.joe@gmail.com' }],
				'reminders': {
					'useDefault': false,
					'overrides': [
						{ 'method': 'email', 'minutes': 24 * 60 },
						{ 'method': 'popup', 'minutes': 10 }
					]
				}
			};
		var request = gapi.client.calendar.events.insert(
			{
				'calendarId': 'primary',
				'resource': event
			}
		);
		request.execute(function (event) {
			display('Event created: ' + event.htmlLink);
		}
		);
	}

	//function to add a message to the popup
	display(message): void {
		var pre = document.getElementById('agenda');
		var textContent = document.createTextNode(message + '\n');
		pre.appendChild(textContent);
	}



}
