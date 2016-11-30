document.addEventListener('DOMContentLoaded', function () {
    main();
});

var events;
var gapi;
let maxEvents;

function main() {
    maxEvents = 2;

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


    function authorize(): void {
        gapi.auth.authorize({
            client_id: '955471480917-2n5jm56c3uucharlj9njl17kbmg72r5h.apps.googleusercontent.com',

            immediate: true,
            scope: 'https://www.googleapis.com/auth/calendar'
        }, function () {
            gapi.client.load('calendar', 'v3', loadEvents);
        });
    }
    document.getElementById("Create").addEventListener("click", createEventsBrowserAction);
    document.getElementById("toggle-body-icon").addEventListener("click", setMaxEvents);
    document.getElementById("toggle-body-icon").addEventListener("click", loadEvents);
}

function setMaxEvents(){
    console.log('Entered setMaxEvents')
    if(maxEvents == 2)
        maxEvents = 30;
    else
         maxEvents = 2;
    document.getElementById('agenda').innerHTML = "<a href=http://www.google.com/calendar>Calendar</a>";

}

// Function to load upcoming events from the user's calendar
function loadEvents(){
    var displayRequest = gapi.client.calendar.events.list(
        {
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'orderBy': 'startTime'
        }
    );
    displayRequest.execute(function(resp)
        {
            events = resp.items;

            if (events.length > 0) { //display next 5 events if they exist
                for (var i = 0; i < events.length && i < maxEvents; i++) {
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                    var summary = event.summary;
                    if(summary == undefined)
                        summary = "(No title)"
                    var date =  when.slice(0 ,when.indexOf('T'));
                    var time = when.slice(when.indexOf('T') + 1, when.slice(when.indexOf('T')).indexOf('-') + when.indexOf('T'))
                    display(summary + '\n' + date + "\n" + time);
                }
            }
            else {
                display('No events.');
            }
        }
    );
}

// Helper function for createEvents()
function createEventsBrowserAction(): void {
    // Get the information from the browser action box
    let summary: string = $("#event_title_input").val();
    let location: string = $("#location_input").val();
    let startDate: string = $("#start_date").val();
    let endDate: string = $("#end_date").val();
    let description: string = $("#textarea1").val();
    let startTime: string = $("#timepicker1").val();
    let endTime: string = $("#timepicker2").val();

    createEvents(summary, location, startDate, endDate, description, startTime, endTime);
}

// Function to add an event to the user's calendar
function createEvents(eventSummary: string, eventLocation: string, eventStartDate: string, eventEndDate: string, eventDescription: string, startTime: string, endTime: string): void {

    let months = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12'
    };

    //format dates to work with Google Calendar API
    let startDay: string = eventStartDate.slice(eventStartDate.indexOf(' ') + 1 ,eventStartDate.indexOf(','));
    let endDay: string = eventEndDate.slice(eventEndDate.indexOf(' ') + 1 ,eventEndDate.indexOf(','));
    if(startDay.length == 1)
        startDay = "0" + startDay
    if(endDay.length == 1)
        endDay = "0" + endDay

    eventStartDate = eventStartDate.slice(-4) + "-" + months[eventStartDate.slice(0, 3)] + "-" + startDay;
    eventEndDate = eventEndDate.slice(-4) + "-" + months[eventEndDate.slice(0, 3)] + "-" + endDay;

    if (startTime.length == 7) {
        startTime = '0' + startTime;
    }
    let finalStartTime: string = startTime.slice(0, -3);
    let finalEndTime: string = endTime.slice(0, -3);

    //Case handles 12:xx AM
    if (startTime.slice(-2) == "AM") {
        if (finalStartTime[0] + finalStartTime[1] == "12") {
            finalStartTime = "00" + finalStartTime.slice(-3);
        }
    }
    if (endTime.slice(-2) == "AM") {
        if (finalEndTime[0] + finalEndTime[1] == "12") {
            finalEndTime = "00" + finalEndTime.slice(-3);
        }
    }

    //Case handles converting PM times
    if (startTime.slice(-2) == "PM") {
        if (finalStartTime[0] + finalStartTime[1] != "12") {
            let hour: string = finalStartTime[0] + finalStartTime[1]
            let hourNum: number = parseInt(hour) + 12;
            hour = hourNum.toString();
            console.log(finalStartTime.slice(2));
            finalStartTime = hour + finalStartTime.slice(2);
        }
    }
    if (endTime.slice(-2) == "PM") {
        if (finalEndTime[0] + finalEndTime[1] != "12") {
            let hour: string = finalEndTime[0] + finalEndTime[1]
            let hourNum: number = parseInt(hour) + 12;
            hour = hourNum.toString();
            console.log(finalEndTime.slice(2));
            finalEndTime = hour + finalEndTime.slice(2);
        }
    }

    let event = {
        'summary': eventSummary,
        'location': eventLocation,
        'description': eventDescription,
        'start': {
            'dateTime': eventStartDate + 'T' + finalStartTime + ':00',
            'timeZone': 'America/New_York'
        },
        'end': {
            'dateTime': eventEndDate + 'T' + finalEndTime + ':00',
            'timeZone': 'America/New_York'
        }
    };
    let request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });
    request.execute(function (event) {
    });
}


//function to add a message to the popup
function display(message): void {
    var pre = document.getElementById('agenda');
    var textContent = document.createTextNode(message + '\n');
    pre.innerHTML = pre.innerHTML + "<div class= card-panel new-event>" + message + "</div>";
}

// Sends events to main.js to be handled by content scripts
// May need to change this so that it doesn't wait for an update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab): void {
    if (changeInfo.status == 'complete' && tab.active) {
        loadEvents();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs): void {
          chrome.tabs.sendMessage(tabs[0].id, events, function(response) {});
        });
    }
})

// Receive messages from the popup iframe and call the 
//  createEvents() function with the appropriate information
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse): void {
    console.log("Received message");
    createEvents(request["summary"], request["location"], request["startDate"], request["endDate"], request["description"], request["startTime"], request["endTime"]);
})