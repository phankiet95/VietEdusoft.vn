var currentShowingQuestion = 0;
var score = 0;
var rightAnswerNumber = 0;
var audio_startGame;
var audio_right;
var audio_wrong;
var audio_end;
var audio_runTime;
var isPlaying = false;

$( document ).ready(function() {
  audio_startGame = document.getElementById('audio_startGame');
  audio_right = document.getElementById('audio_right');
  audio_wrong = document.getElementById('audio_wrong');
  audio_end = document.getElementById('audio_End');
  audio_runTime = document.getElementById('audio_runTime');
  
});

function restartGame() {
  isPlaying = true;
  // Change audio status
  audio_end.pause();
  audio_end.currentTime = 0;
  audio_startGame.play();
  // ---------------------

  startGameAnimation();
  currentShowingQuestion = 0;
  rightAnswerNumber = 0;
  score = 0;
  timeleft = window.setting.countdown;
  $('#timer-text').text(timeleft);
  showScore();
  $('.JudgementBar').removeClass('d-none');
  $('.JudgementBar').removeClass('JudgementBarActive');
  $('.questionDisplay').removeClass('resultDisplayPanel');
  $('.resultDisplay').addClass('d-none');
  $('#question-text').text('');

  setTimeout(function() {
    audio_runTime.play();
    loadNextQuestion();
    countdownFunction('#timer-text');
    window.questionList.forEach((element, i) => {
      element.result = '-';
    });
  }, 7000);

}

function destroyMedia() {
    // destroy all media
    $('.questionMedia').removeClass('questionMediaActive');
    $('#questionMedia_video').attr('src', '');
    $('#questionMedia_video').addClass('d-none');
    $('#questionMedia_audio').attr('src', '');
    $('#questionMedia_audio').addClass('d-none');
    $('#questionMedia_img').attr('src', '');
    $('#questionMedia_img').addClass('d-none');
}

function showResultPanel() {
  $('.question-text').text('Bạn đã trả lời đúng: ' + rightAnswerNumber + '/' + window.questionList.length);
  $('.resultDisplay').removeClass('d-none');
  $('.questionDisplay').addClass('resultDisplayPanel');
  $('.resultTable ').empty();
  $('.resultTable').append('<thead><tr><th>Câu hỏi</th><th>Đáp án</th><th>Kết quả</th></tr></thead>');
  window.questionList.forEach((element, i) => {
    $('.resultTable').append(`<tr><td>${element.question}</td><td>${element.answer}</td><td>${element.result}</td></tr>`);
  });
}

function showMedia(type, src) {
  destroyMedia();
  if ($("#playMusicCheck").prop("checked")) {
    audio_runTime.volume = 1;
  }
  if (type) {
    setTimeout(function() {
      $('.questionMedia').addClass('questionMediaActive');
    }, 500);
    
  } else {
    $('.questionMedia').removeClass('questionMediaActive');
    return;
  }
  setTimeout(function() {
    switch (type) {
      case CONST_VIDEO:
        $('#questionMedia_video').attr('src', src);
        $('#questionMedia_video').removeClass('d-none');
        audio_runTime.volume = 0.1;
        break;
      case CONST_AUDIO:
        $('#questionMedia_audio').attr('src', src);
        $('#questionMedia_audio').removeClass('d-none');
        audio_runTime.volume = 0.1;
        break;
      case CONST_IMAGE:
        $('#questionMedia_img').css('background-image', 'url(' + src + ')');
        $('#questionMedia_img').removeClass('d-none');
        type = 'img';
        break;
      default:
        break;
    }
  }, 500);

}

function showScore() {
  $('#score-text').text(score);
}

function reAnimationJudgementBar() {
  $('.JudgementBar').removeClass('JudgementBarActive');
  setTimeout(function() {
    $('.JudgementBar').addClass('JudgementBarActive');
  }, 500);
}

function endGame() {
  $('.JudgementBar').addClass('d-none');
  isPlaying = false;
  endGameAnimation();
  $('#reloadGameButton').removeClass('d-none');
  destroyMedia();
  showResultPanel();
  clearInterval(timerCountdown);
  audio_runTime.pause();
  audio_runTime.currentTime = 0;
  if (!$("#playMusicCheck").prop("checked")) {
    audio_end.play();
  }
}

// Chơi lại
$(document).on('click', '#StartAgainButton', function () {
  endGame();
});

function startGameAnimation() {
  setTimeout(function() {
    $('.bottombar').addClass('bottombarActive');
  }, 2000);

  setTimeout(function() {
    $('.questionDisplay').addClass('questionDisplayActive');
  }, 3000);

  setTimeout(function() {
    $('.scorebar').addClass('scorebarActive');
  }, 4000);

  setTimeout(function() {
    $('.JudgementBar').addClass('JudgementBarActive');
  }, 5000);

  setTimeout(function() {
    $('.TimerBar').addClass('TimerBarActive');
  }, 6000);
  
}

function endGameAnimation() {
  $('.bottombar').removeClass('bottombarActive');
  $('.questionDisplay').removeClass('questionDisplayActive');
  $('.scorebar').removeClass('scorebarActive');
  $('.JudgementBar').removeClass('JudgementBarActive');
  $('.TimerBar').removeClass('TimerBarActive');
}

$(document).on('click', '#reloadGameButton', function () {
  restartGame();
  $(this).addClass('d-none');
  $('#mainGamePlayPanel').removeClass('d-none');
});

// Click RightAnswer
$(document).on('click', '.rightAnswer', function () {
  reAnimationJudgementBar();
  audio_right.play();
  window.questionList[currentShowingQuestion-1].result = '✓';
  rightAnswerNumber++;
  if (currentShowingQuestion == window.questionList.length) {
    score += 10;
    showScore();
    setTimeout(function() {
      endGame();
    }, 1500);
    
  }

  if (currentShowingQuestion < window.questionList.length) {
    score += 10;
    showScore();
    loadNextQuestion();
  }

  // Add animation then remove it
  $('#score-text').addClass('animate__animated animate__heartBeat');
  setTimeout(() => {
    $('#score-text').removeClass('animate__animated animate__heartBeat');
  }, 1000);
  //-------
});

// Click Wrong answer
$(document).on('click', '.wrongAnwser', function () {
  reAnimationJudgementBar();
  audio_wrong.play();
  window.questionList[currentShowingQuestion-1].result = '✗';
  if (currentShowingQuestion == window.questionList.length) {
    endGame();
  }

  if (currentShowingQuestion < window.questionList.length) {
    loadNextQuestion();
  }
});


function loadNextQuestion() {
  showMedia(window.questionList[currentShowingQuestion].type, window.questionList[currentShowingQuestion].base64);
  $('#question-text').text('');
  var typed = new Typed('#question-text', {
    strings: [window.questionList[currentShowingQuestion].question],
    typeSpeed: 15,
    backSpeed: 0,
    loop: false,
    showCursor: false,
  });
  currentShowingQuestion++;
}