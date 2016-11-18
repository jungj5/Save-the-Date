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
