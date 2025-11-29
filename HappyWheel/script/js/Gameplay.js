var currentShowingQuestion = 0;
var pickedQuestion = 100000;
var score = 0;
var rightAnswerNumber = 0;
var audio_background;
var audio_startGame;
var audio_right;
var audio_wrong;
var audio_end;
var audio_runTime;
var audio_spin_chart;
var isPlaying = false;
const DELAY_SPIN_CHART_SEC = 1000;
const DURATION_SPIN_SEC = 5000;
const DELAY_QUESTION_DISPLAY_SEC = 1000;
const DELAY_SCORE_BAR_SEC = 1000;
const DELAY_JUDGEMENT_BAR_SEC = 1000;
var container;
var spin;
var spinCircle;
var spinText;

$(document).ready(function () {
  audio_startGame = document.getElementById('audio_startGame');
  audio_right = document.getElementById('audio_right');
  audio_wrong = document.getElementById('audio_wrong');
  audio_end = document.getElementById('audio_End');
  audio_runTime = document.getElementById('audio_runTime');
  audio_spin_chart = document.getElementById('audio_spin_chart');
  audio_background = document.getElementById('audio_background');
});

function restartGame() {
  prepareSpinQuestion();

  isPlaying = true;
  // Change audio status
  audio_background.play();
  // ---------------------

  startGameAnimation();
  currentShowingQuestion = 0;
  rightAnswerNumber = 0;
  timeleft = window.setting.countdown;
  window.questionList.forEach((element, i) => {
    element.result = '-';
  });
  $('#timer-text').text(timeleft);
  $('#flip-question-answer').removeClass('d-none');
  $('.JudgementBar').removeClass('d-none');
  $('.JudgementBar').removeClass('JudgementBarActive');
  $('.questionDisplay').removeClass('resultDisplayPanel transparentBar');
  $('.resultDisplay').addClass('d-none');
  $('#question-text').text('✨ Click "😝" to start the Journey 🚀🚀🚀');

  $('#score-text').text("😳");
  removeEventShowAnswer();
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
  $('#flip-question-answer').addClass('d-none');
  $('#result-text').text('You answered correctly: ' + rightAnswerNumber + '/' + window.questionList.length);
  $('.resultDisplay').removeClass('d-none');
  $('.questionDisplay').addClass('resultDisplayPanel transparentBar');
  $('.resultTable ').empty();
  $('.resultTable').append('<thead><tr><th>Question</th><th>Answer</th><th>Result</th></tr></thead>');
  window.questionList.forEach((element, i) => {
    $('.resultTable').append(`<tr><td>${element.question}</td><td>${element.answer}</td><td>${element.result}</td></tr>`);
  });
}

function showMedia(type, src) {
  destroyMedia();
  audio_background.volume = 1;
  if (type) {
    setTimeout(function () {
      $('.questionMedia').addClass('questionMediaActive');
    }, 500);

  } else {
    $('.questionMedia').removeClass('questionMediaActive');
    return;
  }
  setTimeout(function () {
    switch (type) {
      case CONST_VIDEO:
        $('#questionMedia_video').attr('src', src);
        $('#questionMedia_video').removeClass('d-none');
        audio_background.volume = 0.1;
        break;
      case CONST_AUDIO:
        $('#questionMedia_audio').attr('src', src);
        $('#questionMedia_audio').removeClass('d-none');
        audio_background.volume = 0.1;
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
function showScore(type) {
  if (type) {
    $('#score-text').text("😍");
  } else {
    $('#score-text').text("😥");
  }
  
}
function hideSpinChart() {
  $('#questionChartSpin').removeClass('questionChartSpinActive');
}

function reAnimationSpinChart() {
  $('#questionChartSpin').removeClass('questionChartSpinActive');
  setTimeout(function () {
    $('#questionChartSpin').addClass('questionChartSpinActive');
  }, DELAY_SPIN_CHART_SEC);
}

function hideJudgementBar() {
  $('.JudgementBar').removeClass('JudgementBarActive');
}

function reAnimationJudgementBar() {
  $('.JudgementBar').removeClass('JudgementBarActive');
  setTimeout(function () {
    $('.JudgementBar').addClass('JudgementBarActive');
  }, DELAY_JUDGEMENT_BAR_SEC);
}

function reAnimationQuestionDisplay() {
  $('.questionDisplay').removeClass('questionDisplayActive');
  setTimeout(function () {
    $('.questionDisplay').addClass('questionDisplayActive');
  }, DELAY_QUESTION_DISPLAY_SEC);
}

function reAnimationScoreBar() {
  $('.scorebar').removeClass('scorebarActive');
  setTimeout(function () {
    $('.scorebar').addClass('scorebarActive');
  }, DELAY_SCORE_BAR_SEC);
}

function endGame() {
  $('.JudgementBar').addClass('d-none');
  isPlaying = false;
  hideSpinChart();
  endGameAnimation();
  $('#reloadGameButton').removeClass('d-none');
  $('#StartAgainButton').addClass('d-none');
  destroyMedia();
  showResultPanel();
  clearInterval(timerCountdown);
  removeEventShowAnswer();
}

function startGameAnimation() {
  setTimeout(function () {
    $('.bottombar').addClass('bottombarActive');
  }, 2000);

  setTimeout(function () {
    $('#questionChartSpin').addClass('questionChartSpinActive');
  }, DELAY_SPIN_CHART_SEC);

  setTimeout(function () {
    $('.questionDisplay').addClass('questionDisplayActive');
  }, 3000);

  setTimeout(function () {
    $('.scorebar').addClass('scorebarActive');
  }, 4000);

  setTimeout(function () {
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
  $('#StartAgainButton').removeClass('d-none');
});

$(document).on('click', '#StartAgainButton', function () {
  endGame();
  //restartGame();
  $('#mainGamePlayPanel').removeClass('d-none');
});



// Click RightAnswer
$(document).on('click', '.rightAnswer', function () {
  resetCountdownFunction();
  allowSpinAfterAnswer();
  hideJudgementBar();
  audio_right.play();
  window.questionList[pickedQuestion].result = '✓';
  showAnswer();
  rightAnswerNumber++;
  if (currentShowingQuestion == window.questionList.length) {
    showScore(true);
    setTimeout(function () {
      endGame();
    }, 1500);
  }

  if (currentShowingQuestion < window.questionList.length) {
    showScore(true);
  }

  // Add animation then remove it
  $('#score-text').addClass('animate__animated animate__heartBeat');
  setTimeout(() => {
    $('#score-text').removeClass('animate__animated animate__heartBeat');
  }, 1000);
  //-------});
});
function handleWongAnswer() {
  resetCountdownFunction();
  allowSpinAfterAnswer();
  hideJudgementBar();
  audio_wrong.play();
  window.questionList[pickedQuestion].result = '✗';
  showAnswer();
  showScore(false);
  if (currentShowingQuestion == window.questionList.length) {
    showScore(false);
    setTimeout(function () {
      endGame();
    }, 1500);
  }
    // Add animation then remove it
    $('#score-text').addClass('animate__animated animate__heartBeat');
    setTimeout(() => {
      $('#score-text').removeClass('animate__animated animate__heartBeat');
    }, 1000);
    //-------});
}

// Click Wrong answer
$(document).on('click', '.wrongAnwser', function () {
  handleWongAnswer();
});


// click question display to show answer
function addEventShowAnswer() {
    if ($("#flip-question-answer").hasClass("flip-question-answer-active")) {
      $("#flip-question-answer").removeClass("flip-question-answer-active");
    } else {
      $("#flip-question-answer").addClass("flip-question-answer-active");
    }
}

function removeEventShowAnswer() {
  $("#flip-question-answer").removeClass("flip-question-answer-active");
  $(document).off('click', '#flip-question-answer', addEventShowAnswer);
}

function showAnswer() {
  $("#answer-text").text(window.questionList[pickedQuestion].answer);
  $("#flip-question-answer").removeClass("flip-question-answer-active");
  $("#flip-question-answer").addClass("flip-question-answer-active");
  $(document).on('click', '#flip-question-answer', addEventShowAnswer);

}

function loadNextQuestion(picked) {
  removeEventShowAnswer();
  showMedia(window.questionList[picked].type, window.questionList[picked].base64);
  $('#question-text').text('');
  $('#score-text').text("😳");
  var typed = new Typed('#question-text', {
    strings: [window.questionList[picked].question],
    typeSpeed: 15,
    backSpeed: 0,
    loop: false,
    showCursor: false,
  });
  currentShowingQuestion++;
}

function allowSpinAfterAnswer() {
  // set event click spin
  container.on("click", spin);
  container.style({ "cursor": "pointer" });
  spinCircle.style({ "cursor": "pointer" });
  spinText.style({ "cursor": "pointer" });
  //spinText.attr("class", "spin-text-shadows");
}

function getRandomNumbers() {
  var array = new Uint16Array(1000);
  var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
  if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
    window.crypto.getRandomValues(array);
    console.log("works");
  } else {
    //no support for crypto, get crappy random numbers
    for (var i = 0; i < 1000; i++) {
      array[i] = Math.floor(Math.random() * 100000) + 1;
    }
  }
  return array;
}

$(document).ready(function () {

});

function prepareSpinQuestion() {
  var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 600 - padding.left - padding.right,
    h = 600 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    oldpick = [],
    color = d3.scale.category20();//category20c()
  //randomNumbers = getRandomNumbers();
  // { "label": "Dell LAPTOP", "value": 1, "question": "What ..." }, // padding
  var data = window.questionList.map((ques, idx) => {
    return {
      label: "Question " + (idx + 1),
      question: ques.question,
      answer: ques.answer
    }
  })
  // clear spin previous
  $("#questionChartSpin *").remove();
  var svg = d3.select('#questionChartSpin')
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
  container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
  var vis = container
    .append("g");

  var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(r);
  // select paths, use arc generator to draw
  var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs.append("path")
    .attr("fill", function (d, i) { return color(i); })
    .attr("d", function (d) { return arc(d); });
  // add the text
  arcs.append("text").attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
  })
    .attr("text-anchor", "end")
    .text(function (d, i) {
      return data[i].label;
    });
  spin = (d) => {
  container.on("click",destroyMedia());

    audio_spin_chart.play();
    spinText.attr("class", "");
    container.on("click", null);
    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if (oldpick.length == data.length) {
      console.log("done");
      return;
    }
    var ps = 360 / data.length,
      pieslice = Math.round(1440 / data.length),
      rng = Math.floor((Math.random() * 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);

    pickedQuestion = Math.round(data.length - (rotation % 360) / ps);
    pickedQuestion = pickedQuestion >= data.length ? (pickedQuestion % data.length) : pickedQuestion;
    if (oldpick.indexOf(pickedQuestion) !== -1) {
      d3.select(this).call(spin);
      return;
    } else {
      oldpick.push(pickedQuestion);
    }
    rotation += 90 - Math.round(ps / 2);
    vis.transition()
      .duration(DURATION_SPIN_SEC)
      .attrTween("transform", rotTween)
      .each("end", function () {
        //mark question as seen
        d3.select(".slice:nth-child(" + (pickedQuestion + 1) + ") path")
          .attr("fill", "#111");

        //populate question
        //audio_startGame.play();
        //audio_runTime.play();
        reAnimationQuestionDisplay();
        setTimeout(function () {
          loadNextQuestion(pickedQuestion);
        }, DELAY_QUESTION_DISPLAY_SEC);
        reAnimationScoreBar();
        reAnimationJudgementBar();
        remuseCountdownFunction('#timer-text', handleWongAnswer);

        /* Get the result value from object "data" */
        // console.log(data[pickedQuestion - 1].value)

        oldrotation = rotation;

        /* Comment the below line for restrict spin to sngle time */
        // container.on("click", spin);
        container.on("click", null);
        container.style({ "cursor": "not-allowed" });
        spinCircle.style({ "cursor": "not-allowed" });
        spinText.style({ "cursor": "not-allowed" });

      });
  }
  container.on("click", spin);

  //make arrow
  svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
    .style({ "fill": "black" });
  //draw spin circle
  spinCircle = container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({ "fill": "white", "cursor": "pointer" });
  //spin text
  spinText = container.append("text")
    .attr("x", 0)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    //.attr("class", "spin-text-shadows")
    // Quay
    .text("😝")
    .style({ "font-weight": "bold", "font-size": "100px", "cursor": "pointer" });

  function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
      return "rotate(" + i(t) + ")";
    };
  }
}
