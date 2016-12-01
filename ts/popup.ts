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
    startTime: '12:00'
});

// If the popup is being displayed in an iFrame,
// gets the date and time from the corresponding elements and
// sends them to the background script.
if (document.URL.indexOf('hover') != -1){
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
}

//#########################Auto-fill implementation###########################
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

var word = decodeURIComponent(window.location.search.substring(window.location.search.indexOf('date=')));
word = word.slice(5, word.length);
if (word.indexOf("(") == 34){
  var d = new Date(word);
  if (document.URL.indexOf('hover') != -1){
    $('#start_date').val(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());
    if (formatAMPM(d).indexOf(":") == 1){
      $('#timepicker1').val("0" + formatAMPM(d));
    }
    else{
      $('#timepicker1').val(formatAMPM(d));
    }

    //Default duration of event if no end time given = 1 hour
    if ($('#timepicker1').val().slice(0, 2) == "12") {
      var end_time = "01:" + $('#timepicker1').val().slice(-5, -3);
      if ($('#timepicker1').val().slice(-2) == "PM") {
        end_time = end_time + " PM";
        $('#timepicker2').val(end_time);
        $('#end_date').val(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());
      }
      else {
        end_time = end_time + " AM";
        $('#timepicker2').val(end_time);
        $('#end_date').val(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());
      }
    }
    else {
      var start_hour = $('#timepicker1').val().slice(0, 2);
      var start_hour = parseInt(start_hour);
      if (start_hour.toString().length == 2) {
        start_hour = start_hour + 1;
        var end_hour = start_hour.toString();
        var end_time = end_hour + $('#timepicker1').val().slice(-5, -3) + $('#timepicker1').val().slice(-2);
        $('#timepicker2').val(end_time);
        $('#end_date').val(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());
      }
      else{
        start_hour = start_hour + 1;
        if (start_hour == 10) {
          var end_hour = start_hour.toString() + ":";
        }
        else{
          var end_hour = "0" + start_hour.toString() + ":";
        }
        var end_time = end_hour + $('#timepicker1').val().slice(-5, -3) + " " + $('#timepicker1').val().slice(-2);
        $('#timepicker2').val(end_time);
        $('#end_date').val(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());
      }

    }
  }
}


//Nov 1, 2016
//12:00 PM
//Only autofill date if using iFrame hover instead of browser action button.