
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

$('.timepicker').timepicker({
    dynamic: false,
    startTime: '12:00'
});

// <<<<<<< HEAD
$('#Create').click(function() {
    var Event_Summary = $("#event_title_input").val();
    var Event_Location = $("#location_input").val();
    var Event_Start_Date = $("#start_date").val();
    var Event_End_Date = $("#end_date").val();
    var Event_Description = $("#textarea1").val();
    let message = {
        summary: Event_Summary,
        location: Event_Location,
        startDate: Event_Start_Date,
        endDate: Event_End_Date,
        description: Event_Description
    };
    parent.postMessage(message, '*');
})
// =======
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
var d = new Date(word);


//Nov 1, 2016
//12:00 PM
//Only autofill date if using iFrame hover instead of browser action button.
if (document.URL.indexOf('hover') != -1){
  $('#start_date').val(monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());
  $('#timepicker1').val(formatAMPM(d));
}
// >>>>>>> 853f36f6039d4436813493c2f6d831cc1cc42f44
