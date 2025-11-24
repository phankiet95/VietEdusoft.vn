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