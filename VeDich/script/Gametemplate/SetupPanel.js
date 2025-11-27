// Mute background Music
$(document).on('change', '#playMusicCheck', () => {
  console.log('isPlayMusic', $("#playMusicCheck").prop("checked"));
  if (!$("#playMusicCheck").prop("checked")) {
    audio_runTime.volume = 0;
    audio_startGame.volume = 0;
    audio_end.volume = 0;
    audio_right.volume = 0;
    audio_wrong.volume = 0;
  } else {
    audio_runTime.volume = 1;
    audio_startGame.volume = 1;
    audio_end.volume = 1;
    audio_right.volume = 1;
    audio_wrong.volume = 1;
  }
});

// Change fontsize
$(document).on('change', '#fontSize', () => {
  size = $('#fontSize').val();
  setting.font.fontSize = parseInt(size);
  $('.question-text').css('font-size', setting.font.fontSize);
});

// Open/close setupPanel
$(document).on('click', '#setupBtn', function () {
  console.log('open/close SetupPanel');
  $('#setupPanel').toggleClass('active');
  $(this).toggleClass('active');
});

// Open/close QuestionList
$(document).on('click', '.hideQuestionList', function () {
  console.log('open/close QuestionList');
  $('#leftPanel').toggleClass('active');
  $(this).toggleClass('active');
});

// Click on Hủy video/image background button
$(document).on('click', '#setupPanel #destroyBackgroundMedia', function () {
  // delete current background image
  $('.slideList')[0].style.removeProperty('background-image');
  // reset default background video source
  window.gameCustomAsset.forEach(element => {
    if (element.name == 'backgroundSlideVideo') {
        $(`[name=${element.name}]`).attr('src', element.base64);
    }
  });
});

$(document).on('input', '#setupPanel .background', function () {
  let file = $(this)[0].files[0];
  if (file.size > CONST_MAX_SIZE_ALLOW) {
    alert(ERROR_MAX_SIZE_ALLOW);
    return;
  }
  toBase64(file, (base64) => {
    let player = document.getElementById('backgroundSlideVideo');
    if (file.type.includes('video')) {
      $('.slideList')[0].style.removeProperty('background-image');
      base64 = `data:video/mp4;base64,${base64}`;
      player.setAttribute('src', base64);
      setting.background = { type: 'video', name: file.name, base64 };
    } else if (file.type.includes('image')) {
      player.removeAttribute('src');
      base64 = `data:image/gif;base64,${base64}`;
      $('.slideList').css('background-image', 'url(' + base64 + ')');
      setting.background = { type: 'image', name: file.name, base64 };
    }
  });
  $(this).val(null);
});

// Change font color
$(document).on('change', '#setupPanel .color', function () {
  $('.slideList').css('color', $(this).val());
  setting.cell.color = $(this).val();
});

// Change time countdown
$(document).on('change', '#setupPanel .countdown', function () {
  window.setting.countdown = $(this).val();
});

// Change time countdownOthers
$(document).on('change', '#setupPanel .countdownOthers', function () {
  window.setting.countdownOthers = $(this).val();
});

$(document).on('click', '#setupPanel #fullscreenbtn', function () {
  toggle_full_screen();
});


