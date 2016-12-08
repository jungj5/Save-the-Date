$('#gCalLink').click(function() {
    console.log("Google calendar link clicked");
    chrome.tabs.create({active: true, url: "http://www.google.com/calendar"});
});

// Expand popup functionality
$('#toggle-body').click(function() {
    let newWidth: string = '500px';
    if ($('body').width() == 500) {
        newWidth = '350px';
        $('#toggle-body-icon').text('keyboard_arrow_right');
    } else {
        $('#toggle-body-icon').text('keyboard_arrow_left');
    }
    $('body').animate({width: newWidth});
});

// Initialize the date picker input field
$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year

    format: 'mmm d, yyyy',
    formatSubmit: 'yyyy-mm-dd',

    closeOnSelect: true,
    closeOnClear: true,

    onClose: function() {
        $('.datepicker').blur();
    },

    onSet: function(set) {
        if (!set.highlight) {
            $('.datepicker').close();
        }
    }
});

// Initialize the date picker input field
$('.timepicker').timepicker({
    dynamic: false,
});
$('.timepicker').click(function() {
    $('.ui-timepicker-viewport').scrollTop(495);
});

// If the popup is being displayed in an iFrame,
// gets the date and time from the corresponding elements and
// sends them to the background script.
//if (document.URL.indexOf('hover') != -1
    $('#Create').click(function() {
        const Event_Summary = $("#event_title_input").val();
        const Event_Location = $("#location_input").val();
        const Event_Start_Date = $("#start_date").val();
        const Event_End_Date = $("#end_date").val();
        const Event_Description = $("#textarea1").val();
        const eventStartTime: string = $("#timepicker1").val();
        const eventEndTime: string = $("#timepicker2").val();
        const message = {
            summary: Event_Summary,
            location: Event_Location,
            startDate: Event_Start_Date,
            endDate: Event_End_Date,
            description: Event_Description,
            startTime: eventStartTime,
            endTime: eventEndTime
        };

        chrome.runtime.sendMessage(message);

    })
//}

//#########################Auto-fill implementation###########################

//Helper function for reformatting the times.
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

//Grab hover_popup.html url
var word = decodeURIComponent(window.location.search.substring(window.location.search.indexOf('date=')));
word = word.slice(5, word.length); //get the date from the url

//Check if there are two dates in the url.
var count = (word.match(/date=/g) || []).length;

//If there are two dates..
if (count == 1) {
  var endTime = word.slice(word.indexOf('date=') + 5, word.length);
  var startTime = word.slice(0, word.indexOf('?date='));
  var d1 = new Date(startTime);
  var d2 = new Date(endTime);

  //if we are in the hover popup... Do the autofill.
  if (document.URL.indexOf('hover') != -1) {

    //Autofills the start and end dates of the event
    $('#start_date').val(monthNames[d1.getMonth()] + " " + d1.getDate() + ", " + d1.getFullYear());
    $('#end_date').val(monthNames[d2.getMonth()] + " " + d2.getDate() + ", " + d2.getFullYear());

    //Format the times to be of a format that the API can take in.
    if (formatAMPM(d1).indexOf(":") == 1){
      $('#timepicker1').val("0" + formatAMPM(d1));
    }
    else{
      $('#timepicker1').val(formatAMPM(d1));
    }

    if (formatAMPM(d2).indexOf(":") == 1){
      $('#timepicker2').val("0" + formatAMPM(d2));
    }
    else{
      $('#timepicker2').val(formatAMPM(d2));
    }
  }
}

else {
  var d = new Date(word);

  //Do this only if the popup is the hover popup and not the browser action button.
  if (document.URL.indexOf('hover') != -1) {

    //Autofills the date of the event
    $('#start_date').val(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());

    //######### Handle inputting the times now... ###########

    //For the start time, if the hour time of the event is 1 digit.. put a 0 on front of it. Otherwise leave it as is.
    if (formatAMPM(d).indexOf(":") == 1){
      $('#timepicker1').val("0" + formatAMPM(d));
    }
    else{
      $('#timepicker1').val(formatAMPM(d));
    }

    //Now handling end time if no end time was given. (Using event duration of 1 hour as default)
    var d2 = new Date (d);
    d2.setHours(d.getHours() + 1);
    $('#end_date').val(monthNames[d2.getMonth()] + " " + d2.getDate() + ", " + d2.getFullYear());

    //Same as above, if the hour of the time only one digit, prepend a 0. Else leave as is and fill.
    if (formatAMPM(d2).indexOf(":") == 1){
      $('#timepicker2').val("0" + formatAMPM(d2));
    }
    else{
      $('#timepicker2').val(formatAMPM(d2));
    }
  }
}

//########## Required format for inputting date/time #########
//Nov 1, 2016
//12:00 PM

var bgPage = chrome.extension.getBackgroundPage();
var dat =  bgPage.loadEvents();
