var currentShowingQuestion = 0;
var score = 0;
var rightAnswerNumber = 0;
var audio_startGame;
var audio_right;
var audio_wrong;
var audio_end;
var audio_runTime;
var isPlaying = false;
var questionPack = 20;
var currentQuestionList;
var ngoisaohivongLeft = true;
var nextQuesHasStar = false;
var ngoisao = 1;

$( document ).ready(function() {
  audio_startGame = document.getElementById('audio_startGame');
  audio_right = document.getElementById('audio_right');
  audio_wrong = document.getElementById('audio_wrong');
  audio_end = document.getElementById('audio_End');
  audio_runTime = document.getElementById('audio_runTime');
  audio_next = document.getElementById('audio_next');
  audio_star = document.getElementById('audio_star');
});

function restartGame() {
  isPlaying = true;
  // Change audio status
  audio_end.pause();
  audio_end.currentTime = 0;
  audio_startGame.play();

  $('.rightAnswer').show();
  $('.wrongAnswer').show();
  $('.othersPanel').hide();
  $('.starImage').hide();
  $('.nextquestionOlympiaMode').hide();
  $('.scorebar').show();
  $('.showAnwserButton').show();
  $('.ngoisaohivong').show();
  startGameAnimation();
  currentShowingQuestion = 0;
  rightAnswerNumber = 0;
  score = parseInt($('#user-score').val());
  timeleft = window.setting.countdown;
  $('#timer-text').text(timeleft);
  ngoisaohivongLeft = true;
  nextQuesHasStar = false;
  ngoisao = 1;
  showScore();
  $('.JudgementBar').removeClass('d-none');
  $('.JudgementBar').removeClass('JudgementBarActive');
  $('.questionDisplay').removeClass('resultDisplayPanel');
  $('.resultDisplay').addClass('d-none');
  $('#question-text').text('');
  setTimeout(function() {
    //audio_runTime.play();
    //loadNextQuestion();
    $('.nextquestionOlympiaMode').show();

    //countdownFunction('#timer-text');
    currentQuestionList.forEach((element, i) => {
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
  $('.question-text').text('Question and Answer Review');
  $('.resultDisplay').removeClass('d-none');
  $('.questionDisplay').addClass('resultDisplayPanel');
  $('.resultTable ').empty();
  $('.resultTable').append('<thead><tr><th>Question</th><th>Answer</th><th>Result</th></tr></thead>');
  currentQuestionList.forEach((element, i) => {
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

function timeUp() {
  window.timeleft = 0;
  $('#timer-text').text(0);
  audio_runTime.pause();
  audio_runTime.currentTime = 0;
}

function endGame() {
  $('.JudgementBar').addClass('d-none');
  isPlaying = false;
  endGameAnimation();
  $('.reloadGame').removeClass('d-none');
  $('.user-score').removeClass('d-none');
  destroyMedia();
  showResultPanel();
  clearInterval(timerCountdown);
  audio_runTime.pause();
  audio_runTime.currentTime = 0;
  if (!$("#playMusicCheck").prop("checked")) {
    audio_end.play();
  }
  $('#user-score').val(score);
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

function setQuestion() {
  currentQuestionList = [...window.questionList];
  if (questionPack === 20) {
    currentQuestionList.splice(3,3);
  } else {
    currentQuestionList.splice(0,3);
  }

  console.log(currentQuestionList);
}

$(document).on('input', '#user-score', function () {
  $('.reloadGame').removeClass('d-none');
  $('.user-score').removeClass('d-none');
});

$(document).on('click', '#reloadGameButton60', function () {
  restartGame();
  $('.reloadGame').addClass('d-none');
  $('.user-score').addClass('d-none');
  $('#mainGamePlayPanel').removeClass('d-none');
  $('#questionPackage-text').text('Gói câu hỏi 60 điểm');
  questionPack = 20; setQuestion();
  
});

$(document).on('click', '#reloadGameButton90', function () {
  restartGame();
  $('.reloadGame').addClass('d-none');
  $('.user-score').addClass('d-none');
  $('#mainGamePlayPanel').removeClass('d-none');
  $('#questionPackage-text').text('Gói câu hỏi 90 điểm');
  questionPack = 30; setQuestion();
});

// Click RightAnswer
$(document).on('click', '.rightAnswer', function () {
  console.log('rightAnser 1 : ',ngoisao);
  audio_right.play();
  $('.nextquestionOlympiaMode').show();
  if (ngoisaohivongLeft) { 
    $('.ngoisaohivong').show();
  }
  
  $('.othersPanel').hide();
  currentQuestionList[currentShowingQuestion-1].result = '✓';
  rightAnswerNumber++;
  if (currentShowingQuestion == currentQuestionList.length) {
    score += questionPack * ngoisao;
    showScore();
    setTimeout(function() {
      endGame();
    }, 1500);
  }
  if (currentShowingQuestion < currentQuestionList.length) {
    score += questionPack * ngoisao;
    showScore();
  }

  if (ngoisao == 2) {ngoisao = 1; ngoisaohivongLeft = false; nextQuesHasStar = false};

  // Add animation then remove it
  $('#score-text').addClass('animate__animated animate__heartBeat');
  setTimeout(() => {
    $('#score-text').removeClass('animate__animated animate__heartBeat');
  }, 1000);
  //-------
  // reset timer
  timeUp();
  console.log('rightAnser 2 : ',ngoisao);

});

// Click Wrong answer
$(document).on('click', '.wrongAnswer', function () {

  if (ngoisao == 2) {score -= questionPack; showScore(); ngoisao == 1};
  reAnimationJudgementBar();
  audio_wrong.play();
  $('.rightAnswer').hide();
  $('.wrongAnswer').hide();
  $('.time-for-others').show();
  timeUp();
  clearInterval(window.timerCountdown);
  timeleft = window.setting.countdownOthers;
  $('#timer-text').text(timeleft);
  currentQuestionList[currentShowingQuestion-1].result = '✗';
});

// Click time-for-others
$(document).on('click', '.time-for-others', function () {

  audio_runTime.currentTime = 0;
  audio_runTime.play();
  countdownFunction('#timer-text');
  $('.time-for-others').hide();
  $('.mini-btn-panel').show();
});

$(document).on('click', '.others-right', function () {
  // Nếu đang ngôi sao hi vọng thì không trừ điểm nữa, vì đã trừ rồi
  if (ngoisao == 1) {score -= questionPack;};
  
  audio_right.play();
  $('.nextquestionOlympiaMode').show();
  $('.othersPanel').hide();
  timeUp();
  showScore();
  if (ngoisao == 2) {ngoisao = 1; ngoisaohivongLeft = false; nextQuesHasStar = false};

});

$(document).on('click', '.others-wrong', function () {
  audio_wrong.play();
  $('.nextquestionOlympiaMode').show();
  $('.othersPanel').hide();
  timeUp();
  showScore();
  if (ngoisao == 2) {ngoisao = 1; ngoisaohivongLeft = false; nextQuesHasStar = false};

});

// Click Next question Olympia mode
$(document).on('click', '.nextquestionOlympiaMode', function () {

  reAnimationJudgementBar();
  $('.nextquestionOlympiaMode').hide();
  $('.ngoisaohivong').hide();
  $('.starImage').hide();

  if (nextQuesHasStar) {
    $('.starImage').show();
    nextQuesHasStar = false;
  }


  if (currentShowingQuestion == currentQuestionList.length) {
    endGame();
  }
  if (currentShowingQuestion < currentQuestionList.length) {
    loadNextQuestion();
  }

  console.log(ngoisao);
});

$(document).on('click', '.ngoisaohivong', function () {
  ngoisaohivongLeft = false;
  ngoisao = 2;
  nextQuesHasStar = true;
  $('.ngoisaohivong').hide();
  $('#starImage').show();
  audio_star.currentTime = 0;
  audio_star.play();
});



// Click Show answer
$(document).on('click', '.showAnwserButton', function () {
    audio_next.currentTime = 0;
    audio_next.play();
    showAnswer();
    reAnimationJudgementBar();
    $('.showAnwserButton').hide();
});

function showAnswer() {
  console.log('Show Answer');
  timeUp();
  $('#question-text').text(currentQuestionList[currentShowingQuestion-1].answer);
}

function loadNextQuestion() {
  audio_runTime.currentTime = 0;
  audio_runTime.play();
  $('.rightAnswer').show();
  $('.wrongAnswer').show();
  // reset timer
  if (currentShowingQuestion >= 0) {
    clearInterval(window.timerCountdown);
    timeleft = window.setting.countdown;
    $('#timer-text').text(timeleft);
    countdownFunction('#timer-text');
  }
  //------------------------
  showMedia(currentQuestionList[currentShowingQuestion].type, currentQuestionList[currentShowingQuestion].base64);
  $('#question-text').text('');
  var typed = new Typed('#question-text', {
    strings: [currentQuestionList[currentShowingQuestion].question],
    typeSpeed: 15,
    backSpeed: 0,
    loop: false,
    showCursor: false,
  });
  currentShowingQuestion++;
}