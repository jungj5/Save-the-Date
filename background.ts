document.addEventListener('DOMContentLoaded', function () {
    main();
});
var gapi;
function main() {
    //oauth2 auth
    chrome.identity.getAuthToken({ 'interactive': true }, function () {
        //console.log(chrome.runtime.lastError, token);
        //load Google's javascript client libraries
        window.gapi_onload = authorize;
        loadScript('https://apis.google.com/js/client.js');
    });
    function loadScript(url) {
        var request = new XMLHttpRequest();
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
    function authorize() {
        gapi.auth.authorize({
            client_id: '223210400436-gflvl7h6pig37rgvb60o5rbkjuulqhot.apps.googleusercontent.com',
            immediate: true,
            scope: 'https://www.googleapis.com/auth/calendar'
        }, function () {
            gapi.client.load('calendar', 'v3', loadEvents);
        });
    }

    var text = $("event_title_input").val();

    document.getElementById("clickme").addEventListener("click", createEvents);
}
//function to load upcoming events from the user's calendar
function loadEvents() {
    var displayRequest = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });
    displayRequest.execute(function (resp) {
        var events = resp.items;
        if (events.length > 0) {
            display('Upcoming events:');
            for (var i = 0; i < events.length && i < 5; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                display(event.summary + ' (' + when + ')');
            }
        }
        else {
            display('No upcoming events found.');
        }
    });
}
//function to add an event to the user's calendar
function createEvents() {
    var Event_Summary = $("#event_title_input").val();
    var Event_Location = $("#location_input").val();
    var Event_Start_Date = $("#start_date").val();
    var Event_End_Date = $("#end_date").val();

    //Nov 1, 2016
    var Months = {
      'Jan' : '01',
      'Feb' : '02',
      'Mar' : '03',
      'Apr' : '04',
      'May' : '05',
      'Jun' : '06',
      'Jul' : '07',
      'Aug' : '08',
      'Sep' : '09',
      'Oct' : '10',
      'Nov' : '11',
      'Dec' : '12'
    }
    //06:30 PM

    console.log(Event_Start_Date);

    var event = {
        'summary': Event_Summary,
        'location': Event_Location,
        'description': 'Testing event creating for P-I-I app',
        'start': {
            'dateTime': Event_Start_Date + 'T09:00:00',
            'timeZone': 'America/New_York'
        },
        'end': {
            'dateTime': Event_End_Date + "T09:00:00",
            'timeZone': 'America/Los_Angeles'
        },
    };
    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });
    request.execute(function (event) {
        display('Event created: ' + event.htmlLink);
    });
}
//function to add a message to the popup
function display(message) {
    var pre = document.getElementById('agenda');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}
