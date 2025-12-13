$(document).on('click', '#gameIntroBtn', function () {
    console.log('open/close intro');
    $('#gameIntro').toggleClass('active');
    $('#gameIntroBtn').toggleClass('active');

    if ($('#gameIntro').hasClass('active')) {
        $('.gameIntro_text').removeClass('d-none');
    } else {
        $('.gameIntro_text').addClass('d-none');
    }
});


// Close GameIntro when ESC key is pressed
$(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#gameIntro').hasClass('active')) {
        $('#gameIntro').removeClass('active');
        $('#gameIntroBtn').removeClass('active');
        $('.gameIntro_text').addClass('d-none');
    }
});