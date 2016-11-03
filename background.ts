document.addEventListener('DOMContentLoaded', function() {
  main();
});

var events;

function main() {
  //oauth2 auth
  chrome.identity.getAuthToken({ 'interactive': true }, function () {
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
          client_id: '955471480917-2n5jm56c3uucharlj9njl17kbmg72r5h.apps.googleusercontent.com',
          immediate: true,
          scope: 'https://www.googleapis.com/auth/calendar'
      }, function () {
          gapi.client.load('calendar', 'v3', loadEvents);
      });
  }

  document.getElementById("clickme").addEventListener("click", createEvents);
  


}

//function to load upcoming events from the user's calendar
function loadEvents(){
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

    displayRequest.execute(function(resp)
        {
            events = resp.items;
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
function createEvents() {
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
        'attendees': [{ 'email': 'bikramsbajwa6@gmail.com' }],
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
    request.execute(function (event) 
        {
          display('Event created: ' + event.htmlLink);
        }
    );
}
    
//function to add a message to the popup
function display(message) {
    var pre = document.getElementById('agenda');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

// Sends events to main.js to be handled by content scripts
// May need to change this so that it doesn't wait for an update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, events, function(response) {
        console.log(response.farewell);
      });
    });
  }
})