var currentShowingQuestion = 0;
var score = 0;
var rightAnswerNumber = 0;
var audio_startGame;
var audio_right;
var audio_wrong;
var audio_end;
var audio_runTime;
var isPlaying = false;
var currentRightAnswer = 0;

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

  removeAllColor();
  startGameAnimation();
  currentShowingQuestion = 0;
  rightAnswerNumber = 0;
  score = 0;
  timeleft = window.setting.countdown;
  $('#timer-text').text(timeleft);
  showScore();
  $('.answerChoicePanel').removeClass('d-none');
  $('.answerChoicePanel').removeClass('answerChoicePanelActive');
  $('.questionDisplay').removeClass('resultDisplayPanel');
  $('.resultDisplay').addClass('d-none');
  $('#question-text').text('');
  $('#answer-text1').text('');
  $('#answer-text2').text('');
  $('#answer-text3').text('');
  $('#answer-text4').text('');

  setTimeout(function() {

    let isEachQuestion = $("#resetcountdowneach").prop("checked");
    audio_runTime.play();
    loadNextQuestion();
    if(!isEachQuestion) {
      countdownFunction('#timer-text', isEachQuestion);
    }
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
  $('#question-text').text('Right Answers: ' + rightAnswerNumber + '/' + window.questionList.length);
  $('.resultDisplay').removeClass('d-none');
  $('.questionDisplay').addClass('resultDisplayPanel');
  $('.resultTable ').empty();
  $('.resultTable').append('<thead><tr><th>Question</th><th>Answer</th><th>Result</th></tr></thead>');
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
  $('.answerChoicePanel').removeClass('answerChoicePanelActive');
  setTimeout(function() {
    $('.answerChoicePanel').addClass('answerChoicePanelActive');
  }, 500);
}

function endGame() {
  $('.answerChoicePanel').addClass('d-none');
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
    $('.answerChoicePanel').addClass('answerChoicePanelActive');
  }, 5000);

  setTimeout(function() {
    $('.TimerBar').addClass('TimerBarActive');
  }, 6000);
  
}

function endGameAnimation() {
  $('.bottombar').removeClass('bottombarActive');
  $('.questionDisplay').removeClass('questionDisplayActive');
  $('.scorebar').removeClass('scorebarActive');
  $('.answerChoicePanel').removeClass('answerChoicePanelActive');
  $('.TimerBar').removeClass('TimerBarActive');
}

// Start game
$(document).on('click', '#reloadGameButton', function () {
  restartGame();
  $(this).addClass('d-none');
  $('#mainGamePlayPanel').removeClass('d-none');
});

// Chơi lại
$(document).on('click', '#StartAgainButton', function () {
  endGame();
});



// Click The answer
$(document).on('click', '.answerPanel', function () {
  reAnimationJudgementBar();

  const choiceA = $('.answer1')[0];  const choiceB = $('.answer2')[0];
  const choiceC = $('.answer3')[0];  const choiceD = $('.answer4')[0];

  if (choiceA.firstChild.getAttribute('ansVal') == window.questionList[currentShowingQuestion-1].answer) {
    choiceA.classList.add('rightanswerPanel');
  }
  if (choiceB.firstChild.getAttribute('ansVal') == window.questionList[currentShowingQuestion-1].answer) {
    choiceB.classList.add('rightanswerPanel');
  }
  if (choiceC.firstChild.getAttribute('ansVal') == window.questionList[currentShowingQuestion-1].answer) {
    choiceC.classList.add('rightanswerPanel');
  }
  if (choiceD.firstChild.getAttribute('ansVal') == window.questionList[currentShowingQuestion-1].answer) {
    choiceD.classList.add('rightanswerPanel');
  }

  const yourchoice = $(this);
  if (yourchoice.children("p:first").attr('ansVal') != window.questionList[currentShowingQuestion-1].answer) {
    
    $(this).addClass('wronganswerPanel');
  }

  let clickedAnwser = $(this).children("p:first").attr('ansVal');

  console.log('FIrst child clickedAnwser: ', clickedAnwser);


  // Chosed right answer
  if (clickedAnwser == window.questionList[currentShowingQuestion-1].answer) {
    audio_right.play();
    window.questionList[currentShowingQuestion-1].result = '✓';
    rightAnswerNumber++;
    if (currentShowingQuestion == window.questionList.length) {
      score += 10;
      showScore();
      setTimeout(function() {
        endGame();
      }, 2000);
    }
  
    if (currentShowingQuestion < window.questionList.length) {
      score += 10;
      showScore();
      setTimeout(function() {
        loadNextQuestion();
      }, 2000);
    }
  
    // Add animation then remove it
    $('#score-text').addClass('animate__animated animate__heartBeat');
    setTimeout(() => {
      $('#score-text').removeClass('animate__animated animate__heartBeat');
    }, 1000);
    //-------
  } 
  // Chosed woring answer
  else {
    audio_wrong.play();
    window.questionList[currentShowingQuestion-1].result = '✗';
    if (currentShowingQuestion == window.questionList.length) {
      setTimeout(function() {
        endGame();
      }, 2000);
    }
  
    if (currentShowingQuestion < window.questionList.length) {
      setTimeout(function() {
        loadNextQuestion();
      }, 2000);
    }
  }
});

function removeAllColor() {
  const choiceA = $('.answer1')[0];  const choiceB = $('.answer2')[0];
  const choiceC = $('.answer3')[0];  const choiceD = $('.answer4')[0];
  choiceA.classList.remove('rightanswerPanel');
  choiceB.classList.remove('rightanswerPanel');
  choiceC.classList.remove('rightanswerPanel');
  choiceD.classList.remove('rightanswerPanel');
  choiceA.classList.remove('wronganswerPanel');
  choiceB.classList.remove('wronganswerPanel');
  choiceC.classList.remove('wronganswerPanel');
  choiceD.classList.remove('wronganswerPanel');
  choiceA.classList.remove('d-none');
  choiceB.classList.remove('d-none');
  choiceC.classList.remove('d-none');
  choiceD.classList.remove('d-none');
}

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

  let isEachQuestion = $("#resetcountdowneach").prop("checked");
  if (isEachQuestion) {
    timeleft = window.setting.countdown;
    $('#timer-text').text(timeleft);
    if (typeof window.timerCountdown !== 'undefined') {  
      clearInterval(window.timerCountdown);
    }
    countdownFunction('#timer-text', isEachQuestion);
  }

  removeAllColor();

  let answerPool = [];
  // answerPool.push(window.questionList[currentShowingQuestion].answer != null ? window.questionList[currentShowingQuestion].answer : '');
  // answerPool.push(window.questionList[currentShowingQuestion].otherAnswer1 != null ? window.questionList[currentShowingQuestion].otherAnswer1 : '');
  // answerPool.push(window.questionList[currentShowingQuestion].otherAnswer2 != null ? window.questionList[currentShowingQuestion].otherAnswer2 : '');
  // answerPool.push(window.questionList[currentShowingQuestion].otherAnswer3 != null ? window.questionList[currentShowingQuestion].otherAnswer3 : '');
  
  let answerCount = 0;

  if (window.questionList[currentShowingQuestion].answer != '') {
    answerPool.push(window.questionList[currentShowingQuestion].answer);
    answerCount++;
  }
  if (window.questionList[currentShowingQuestion].otherAnswer1 != '') {
    answerPool.push(window.questionList[currentShowingQuestion].otherAnswer1);
    answerCount++;
  }
  if (window.questionList[currentShowingQuestion].otherAnswer2 != '') {
    answerPool.push(window.questionList[currentShowingQuestion].otherAnswer2);
    answerCount++;
  }
  if (window.questionList[currentShowingQuestion].otherAnswer3 != '') {
    answerPool.push(window.questionList[currentShowingQuestion].otherAnswer3);
    answerCount++;
  }
  
  shuffle(answerPool);
  console.log(answerPool);
  if (answerCount >= 1) {
    $('#answer-text1').text('A. ' + answerPool[0]);
    $('#answer-text1').attr('ansVal', answerPool[0]);
  }
  if(answerCount >= 2) {
    $('#answer-text2').text('B. ' + answerPool[1]);
    $('#answer-text2').attr('ansVal', answerPool[1]);
  }
  if(answerCount >= 3) {
    $('#answer-text3').text('C. ' + answerPool[2]);
    $('#answer-text3').attr('ansVal', answerPool[2]);
  }
  if(answerCount >= 4) {
    $('#answer-text4').text('D. ' + answerPool[3]);
    $('#answer-text4').attr('ansVal', answerPool[3]);
  }

  const choiceA = $('.answer1')[0];  const choiceB = $('.answer2')[0];
  const choiceC = $('.answer3')[0];  const choiceD = $('.answer4')[0];

  if (answerCount < 1) {
    choiceA.classList.add('d-none');
  }
  if (answerCount < 2) {
    choiceB.classList.add('d-none');
  }
  if (answerCount < 3) {
    choiceC.classList.add('d-none');
  }
  if (answerCount < 4) {
    choiceD.classList.add('d-none');
  }

  currentShowingQuestion++;
}

