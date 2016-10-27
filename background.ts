document.addEventListener('DOMContentLoaded', function() {
  main();
});

function main() {
  //oauth2 auth
  chrome.identity.getAuthToken({ 'interactive': true }, function () {
    console.log(chrome.runtime.lastError, token);
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
          gapi.client.load('calendar', 'v3', createEvents);
      });
  }
  function createEvents() {
      var event = {
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
          'attendees': [{ 'email': 'dragster.joe@Gmail.com' }],
          'reminders': {
              'useDefault': false,
              'overrides': [
                  { 'method': 'email', 'minutes': 24 * 60 },
                  { 'method': 'popup', 'minutes': 10 }
              ]
          }
      };
      var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
      });
      request.execute(function (event) {
          appendPre('Event created: ' + event.htmlLink);
      });
  }

}
