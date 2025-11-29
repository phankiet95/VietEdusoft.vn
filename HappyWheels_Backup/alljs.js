window.toBase64 = (file, onload) => {
  var reader = new FileReader();
  reader.onload = function () {
    var base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
    onload(base64);
  };
  reader.readAsDataURL(file);
};
window.download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
Array.prototype.shuffle = function () {
  let m = this.length,
    i;
  while (m) {
    i = (Math.random() * m--) >>> 0;
    [this[m], this[i]] = [this[i], this[m]];
  }
  return this;
};
window.animateCSS = (node, animation, func = () => {}, option = '', prefix = 'animate__') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const optionName = `${prefix}${option}`;
    node.addClass([`${prefix}animated`, animationName, optionName]);
    /* When the animation ends, we clean the classes and resolve the Promise */
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.removeClass([`${prefix}animated`, animationName, optionName]);
      func();
      resolve('Animation ended');
    }
    node[0].addEventListener('animationend', handleAnimationEnd, { once: true });
  });

window.obfuscate = (codeText) => {
  const options = {
    compact: false,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1
  };
  const obfuscationResult = JavaScriptObfuscator.obfuscate(codeText, options);

  return obfuscationResult.getObfuscatedCode();
}

window.toDataURL = (url, callback) => {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

window.toTextFromUrl = (url, callback) => {
  $.ajax({
    type: "GET",
    contentType: "application/text",
    url: url,
    dataType: 'text',
    cache: false,
    success: function (data) {
      callback(data)
    },
    error: function (e) {
    }
  });
}

function showAlert(alertText) {
  Swal.fire({
    icon: 'info',
    title: 'Thông báo',
    text: alertText
  });
  $("body").removeClass("swal2-height-auto");
}

function getTimeForFileName() {
  let newDate = new Date();
  let strTime = newDate.toLocaleDateString().replace('/','-') + ' ' + newDate.toLocaleTimeString().replace(':','-');
  console.log('strTime', strTime);
  return strTime;
}

// Need to test this
// $(window).on("load", function() {
//   window.isLoading(true);
// });

// $(document).ready(function() {
//   window.isLoading(false);
// });

function toggle_full_screen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
    }
    else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen();
    }
    else if (document.documentElement.webkitRequestFullScreen) {   /* Chrome, Safari & Opera */
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    else if (document.msRequestFullscreen) { /* IE/Edge */
        document.documentElement.msRequestFullscreen();
    }
  } else {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    }
    else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {   /* Chrome, Safari and Opera */
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
  }
}
// Fie type
const CONST_AUDIO = 'audio';
const CONST_ICON = 'icon';
const CONST_VIDEO = 'video';
const CONST_IMAGE = 'image';

// Select box not option
const CONST_NOTOPTION = 'notOption';

// Element Type
const CONST_CONTROL_SELECTBOX = 'selectBox';

// Configuration Bar
const CONST_FONT_SELECT = 'fontSelect';
const CONST_FONTSIZE_SELECT = 'fontSizeSelect';
const CONST_COUNTDOWN_TEXTBOX = 'countDownTextBox';

// Input file max size
const CONST_MAX_SIZE_ALLOW = 30 * 1024 * 1024;
const ERROR_MAX_SIZE_ALLOW = 'File quá nặng, xin hãy chọn file dưới 30Mb';

// notice
const ERROR_WRONG_GAME = 'File vừa nhập không hợp lệ';
const SUCCESS_IMPORT_GAME = 'Nhập file thành công';
const SUCCESS_OPEN_SAMPLE_GAME = 'Đã mở ví dụ thành công';
const FAILED_OPEN_SAMPLE_GAME = 'Không tìm thấy ví dụ. Hãy kiểm tra lại đường dẫn.';

// Font Family
window.fontList = [
  { name: 'Arial' },
  { name: 'Verdana' },
  { name: 'Helvetica' },
  { name: 'Tahoma' },
  { name: 'Trebuchet MS' },
  { name: 'Times New Roman' },
  { name: 'Georgia' },
  { name: 'Garamond' },
  { name: 'Courier New' },
  { name: 'Brush Script MT' },
];

// Font Size List
window.fontSizeList = [
{ name: '30' },
{ name: '36' },
{ name: '42' },
{ name: '48' },
{ name: '52' },
{ name: '56' },
{ name: '64' },
{ name: '72' },
]

// Init all the Asset
$(document).ready(function () {
  loadAsset(window.gameCustomAsset);
});

function loadAsset(asset) {
  asset.forEach(element => {
      loadAssetAndDestroy(element);
  });
}

function loadAssetAndDestroy(element) {
  if (element.type == CONST_ICON) {
      $(`[name=${element.name}]`).attr('href', element.base64);
      console.log('GamePlayAssetLoader.AssetLoaded: CONST_ICON', element.name);
  }

  if (element.type == CONST_AUDIO) {
      $(`[name=${element.name}]`).attr('src', element.base64);
      console.log('GamePlayAssetLoader.AssetLoaded: CONST_AUDIO', element.name);
  }

  if (element.type == CONST_IMAGE) {
      $(`[name=${element.name}]`).attr('src', element.base64);
      console.log('GamePlayAssetLoader.AssetLoaded: CONST_IMAGE', element.name);
  }

  if (element.type == CONST_VIDEO) {
      $(`[name=${element.name}]`).attr('src', element.base64);
      console.log('GamePlayAssetLoader.AssetLoaded: CONST_VIDEO', element.name);
  }

  if (element.type == CONST_CONTROL_SELECTBOX) {
      loadSelectOption(`[name=${element.name}]`, element.data, false);
  }

  if (element.destroy != 'false') {
      element.base64 = '';
      console.log('element.name cleared');
  }

}
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

$(document).on('click', '#setupPanel #fullscreenbtn', function () {
  toggle_full_screen();
});


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

window.isLoading = (bool) => {
  if (bool) {
      $("#loading")
      .removeClass("d-none")
      .addClass("d-flex");
  } else {
      $("#loading")
      .removeClass("d-flex")
      .addClass("d-none");
  }
}

window.setting = {
  countdown: 30,
  font: { fontFamily: 'Arial', fontSize: 38 },
  gameinfo: {name: 'Happy Wheels'},
  gameIntro: {gameIntro_title:'', gameIntro_detail:''},
};

window.mediaPanel = `
<div class="questionFile">
  <label class="mediaIcon" data-toggle="tooltip" title="Media file">
    <input class="uploadFile" type="file" accept="audio/*,video/*,image/*" data-question-id="">
      <svg class="uploadBtn svgicon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
      </svg>
  </label>

  <label class="mediaIcon" data-toggle="tooltip" title="Hủy media file">
    <svg class="mediaCancel d-none svgicon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </label>
</div>`;

window.questionPanel = `
  <div class="question">
    <div class="input-group mr-sm-2">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <strong>1</strong>
        </div>
      </div>
      <textarea type="text" class="form-control inputQuestion" placeholder="Câu hỏi" rows="3"></textarea>
      ${mediaPanel}
    </div>
    <div class="input-group mr-sm-2 mt-2">
      <input type="text" class="form-control inputAnswer" placeholder="Đáp án">
    </div>
  </div>`;

  var total;
  var timeleft;
  function countdownFunction(elementId, callback) {
      window.timerCountdown = setInterval(function () {
          if (timeleft <= 0) {
              clearInterval(timerCountdown);
              if (callback) {
                  callback();
              }
              console.log('Time up');
          }
  
          $(elementId).text(timeleft);
              timeleft -= 1;
      }, 1000);
  
  
  };
  
  function pauseCountdownFunction() {
      clearInterval(window.timerCountdown);
  }
  
  function remuseCountdownFunction(elementId, callback) {
      countdownFunction(elementId, callback);
  }
  
  function resetCountdownFunction() {
      clearInterval(window.timerCountdown);
      timeleft = window.setting.countdown;
      $('#timer-text').text(timeleft);
  }

  
  
// Lưu game Intro
function saveIntro() {
  window.setting.gameIntro.gameIntro_title = $('#gameIntro_title').text();
  window.setting.gameIntro.gameIntro_detail = $('#gameIntro_detail').text();

  console.log(window.setting.gameIntro.gameIntro_title);
  console.log(window.setting.gameIntro.gameIntro_detail);

}

// Get game Intro
function setIntro() {
$('#gameIntro_title').text(window.setting.gameIntro.gameIntro_title);
$('#gameIntro_detail').text(window.setting.gameIntro.gameIntro_detail);
}

/* MAIN */
$(document).on('click', '#exportHtml', function () {
  console.log('Start download');
  window.isLoading(true);
  // Lưu game Intro
  saveIntro();
  let html = $('html').clone();
  html.find('.main_container>:not(#createPage)').remove();
  html.find('#createPage>:not(.main_view)').remove();
  html.find('.main_view>:not(.slideList)').remove();
  html.find('.slideList').css('max-height', '100vh');
  html.find('.score_board .win, .score_board .loose').addClass('d-none');
  html.find('.slideList').append(`<p id="game_data_text" class="d-none">${JSON.stringify({ data: window.questionList, setting })}</p>`);
  html.find('link[rel="stylesheet"], script:not([type="text/javascript"])').remove();
  download(
    window.setting.gameinfo.name + '_' +getTimeForFileName()+'.html',
    html
      .wrapAll('<div>')
      .parent()
      .html()
      .replace(/<!.+-->/g, '')
  );

  setTimeout(() => {
    window.isLoading(false);
  }, 5000)

});

$(document).on('click', '#exportDataFile', function () {
  console.log('Start download Data');
  window.isLoading(true);
  // Lưu game Intro
  saveIntro();
  let dataSaved = JSON.stringify({ data: window.questionList, setting });
  //download(`${window.setting.gameinfo.name}_${getTimeForFileName()}.VietEduSoft`, dataSaved);
  downloadPlainText(`${window.setting.gameinfo.name}_${getTimeForFileName()}.VietEduSoft`, dataSaved);

  setTimeout(() => {
    window.isLoading(false);
  }, 1000)

});

function downloadPlainText(filename, text) {
  console.log('New Download function');
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

$(document).on('change', '#importHtml', function () {
  try {
    var file = $(this)[0].files[0];
    $(this).val(null);
    let extension = file.name.split(".").pop();
    console.log('File extension: ', extension);
    if (extension == 'html') {
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        Promise.resolve($(reader.result).find('#game_data_text').text())
          .then(JSON.parse)
          .then(({ data, setting }) => {
            if (setting.gameinfo.name === window.setting.gameinfo.name) {
                window.setting = setting;
                window.questionList = data;
                loadQuestionFromListData();
                loadBackground();
                $('.countdown').val(window.setting.countdown);
                currentChosenIndex = -1;
                showAlert(SUCCESS_IMPORT_GAME);
            } else {
              showAlert(ERROR_WRONG_GAME);
            }
          });
      };
    }
  
    else if (extension == 'VietEduSoft') {
      console.log('file .VietEduSoft');
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        let jsonData = JSON.parse(reader.result);
        console.log(jsonData.gameinfo);
        // If setting.gameinfo.name from File equal to gameinfoName in GameEditor.js
        if (jsonData.setting.gameinfo.name === window.setting.gameinfo.name) {
          window.setting = jsonData.setting;
          window.questionList = jsonData.data;
          loadQuestionFromListData();
          loadBackground();
          $('.countdown').val(window.setting.countdown);
          currentChosenIndex = -1;
          showAlert(SUCCESS_IMPORT_GAME);
        } else {
          showAlert(ERROR_WRONG_GAME);
        }
      }
    }
  } catch (err) {
    showAlert(ERROR_WRONG_GAME);
    console.log('err = ', err);
  }


});

function loadBackground() {
  let player = document.getElementById('backgroundSlideVideo');
  if (setting.background && setting.background.type && setting.background.type.includes('video')) {
    $('.slideList')[0].style.removeProperty('background-image');
    //base64 = `data:video/mp4;base64,${setting.background.base64}`;
    player.setAttribute('src', setting.background.base64);
    //setting.background = { type: 'video', name: file.name, base64 };
  } else if (setting.background && setting.background.type && setting.background.type.includes('image')) {
    player.removeAttribute('src');
    //base64 = `data:image/gif;base64,${setting.background.base64}`;
    $('.slideList').css('background-image', 'url(' + setting.background.base64 + ')');
    //setting.background = { type: 'image', name: file.name, base64 };
  }
}

// GameEditor.js: This script is for editting question

window.questionList = [];
let currentChosenIndex = 0;
var uploadedFileChanged = false;
window.isEditorMode = true;
window.gameinfoName = 'HoiDapNhanh';

function addQuestion() {
  console.log('Add question ', window.questionList.length);
  // Add question to questionList
  var newQuestion = {question: "Câu hỏi", answer: "Đáp án"};
  window.questionList.push(newQuestion);

  // Add question to UI
  let questionPanel = window.questionPanel.replace('<strong>1</strong>', `<strong>${window.questionList.length}</strong>`);
  $(`#questionList`).append(questionPanel);
  window.questionList.length > 1 ? $('#btnDel').removeAttr('disabled') : $('#btnDel').attr('disabled');

  // Scroll into the end
  var questionListPanel = document.getElementById('questionList');
  questionListPanel.scrollTop = questionListPanel.scrollHeight;

  // Auto choose the last one
  $('.question').eq(window.questionList.length-1).trigger('click');
}

function removeQuestion() {
  console.log('Remove question ', currentChosenIndex);
  window.questionList.splice(currentChosenIndex, 1);
  $('.question').eq(currentChosenIndex).remove();
  window.questionList.length > 1 ? $('#btnDel').removeAttr('disabled') : $('#btnDel').attr('disabled');
  // Reindexing after remove question
  reIndexing();
}

function reIndexing() {
  window.questionList.forEach((element, i) => {
      $('.question').eq(i).find('.input-group-text').empty();
      $('.question').eq(i).find('.input-group-text').append(`<strong>${i+1}</strong>`);
  });
}

function loadQuestionFromListData() {
  // Clear all current question
  $('#questionList').empty();
  //currentChosenIndex = -1;
  window.questionList.forEach((element, i) => {
      // Add question to UI
      let questionPanel = window.questionPanel.replace('<strong>1</strong>', `<strong>${i+1}</strong>`);
      $(`#questionList`).append(questionPanel);

      // Set value on UI
      $('.question .inputQuestion').eq(i).val(element.question);
      $('.question .inputAnswer').eq(i).val(element.answer);
      if (element.type) {
          $('.question .uploadBtn').eq(i).addClass('uploaded');
          $('.question .mediaCancel').eq(i).removeClass('d-none');
      }
  });
  window.questionList.length > 1 ? $('#btnDel').removeAttr('disabled') : $('#btnDel').attr('disabled');
}

function destroyMediaPreview() {
  // destroy all media
  $('#PreviewquestionMedia_video').attr('src', '');
  $('#PreviewquestionMedia_video').addClass('d-none');
  $('#PreviewquestionMedia_audio').attr('src', '');
  $('#PreviewquestionMedia_audio').addClass('d-none');
  $('#PreviewquestionMedia_img').attr('src', '');
  $('#PreviewquestionMedia_img').addClass('d-none');
}

function loadMediaPreview(type, src) {
  destroyMediaPreview();
  console.log('type = ',type);
  if (!type) {
      console.log('Hide questionMediaPreview');
      $('.questionMediaPreview').removeClass('questionMediaPreviewActive');
      return;
  } else {
      $('.questionMediaPreview').addClass('questionMediaPreviewActive');
  }
  switch (type) {
      case CONST_VIDEO:
        $('#PreviewquestionMedia_video').attr('src', src);
        $('#PreviewquestionMedia_video').removeClass('d-none');
        audio_background.volume = 0.1;
        break;
      case CONST_AUDIO:
        $('#PreviewquestionMedia_audio').attr('src', src);
        $('#PreviewquestionMedia_audio').removeClass('d-none');
        audio_background.volume = 0.1;
        break;
      case CONST_IMAGE:
        //$('#PreviewquestionMedia_img').css('background-image', 'url(' + src + ')');
        $('#PreviewquestionMedia_img').attr("src", src);
        $('#PreviewquestionMedia_img').removeClass('d-none');
        type = 'img';
        break;
      default:
        break;
    }
}

function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

function upQuestion() {
  if (currentChosenIndex <= 0) {
      return;
  }
  arraymove(questionList, currentChosenIndex, currentChosenIndex-1);
  loadQuestionFromListData();
  $('.question').eq(currentChosenIndex-1).trigger('click');
}

function downQuestion() {
  if (currentChosenIndex >= questionList.length-1 || currentChosenIndex < 0) {
      return;
  }
  arraymove(questionList, currentChosenIndex, currentChosenIndex+1);
  loadQuestionFromListData();
  $('.question').eq(currentChosenIndex+1).trigger('click');
}

// Event handle section
$(document).on('click focus', '.question', function () {
  console.log('Clicked on question ', $(this).index());
  if ($(this).index() == currentChosenIndex) { 
      return;
  }
  currentChosenIndex = $(this).index();
  $('.question').removeClass('chosen');
  // Show Chosen Question on UI
  $(this).addClass('chosen');
  // question media preview
  loadMediaPreview(window.questionList[currentChosenIndex].type, window.questionList[currentChosenIndex].base64);
});

$(document).on('click', '#btnAdd', function () {
  addQuestion();
});

$(document).on('click', '#btnDel', function () {
  removeQuestion();
});

$(document).on('click', '#btnUp', function () {
  upQuestion();
});

$(document).on('click', '#btnDown', function () {
  downQuestion();
});

// When Typing question
$(document).on('change', '.inputQuestion', function () {
  window.questionList[currentChosenIndex].question = $(this).val();
  console.log('Change question ', $(this).val());
});

// When Typing answer
$(document).on('change', '.inputAnswer', function () {
  window.questionList[currentChosenIndex].answer = $(this).val();
  console.log('Change answer ', $(this).val());
});
function processFile(file) {
if (!file) {
  return;
}
// Load the data into an image
new Promise(function (resolve, reject) {
  let rawImage = new Image();

  rawImage.addEventListener("load", function () {
    resolve(rawImage);
  });

  rawImage.src = URL.createObjectURL(file);
})
  .then(function (rawImage) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    canvas.width = rawImage.width;
    canvas.height = rawImage.height;
    ctx.drawImage(rawImage, 0, 0);

    const output = canvas.toDataURL("image/webp",0.8).replace('data:', '').replace(/^.+,/, '');

    window.questionList[currentChosenIndex].base64 = `data:image/gif;base64,${output}`;
    window.questionList[currentChosenIndex].type = CONST_IMAGE;
  });
}
// Upload question file
$(document).on('change', '.uploadFile', function () {
  let file = $(this)[0].files[0];
  if (file.size > CONST_MAX_SIZE_ALLOW) {
      showAlert(ERROR_MAX_SIZE_ALLOW);
      return;
  }
  const fileType = file['type'];
  // Not change to Webp if image is image/gif
  if (fileType != 'image/gif' && !file.type.includes(CONST_AUDIO) && !file.type.includes(CONST_VIDEO)) {
      console.log('Convert to Webp');
      processFile(file);
  } else {
      toBase64(file, (base64) => {
          if (file.type.includes(CONST_AUDIO)) {
              window.questionList[currentChosenIndex].base64 = `data:audio/mp3;base64,${base64}`;
              window.questionList[currentChosenIndex].type = CONST_AUDIO;
          }
          if (file.type.includes(CONST_VIDEO)) {
              window.questionList[currentChosenIndex].base64 = `data:video/mp4;base64,${base64}`;
              window.questionList[currentChosenIndex].type = CONST_VIDEO;
          }
          if (file.type.includes(CONST_IMAGE)) {
              window.questionList[currentChosenIndex].base64 = `data:image/gif;base64,${base64}`;
              window.questionList[currentChosenIndex].type = CONST_IMAGE;
          }
      });
  }
  $(this).val(null);
  // Change color of media icon, and show the cancel button
  $('.uploadBtn').eq(currentChosenIndex).addClass('uploaded');
  $('.question .mediaCancel').eq(currentChosenIndex).removeClass('d-none');

  // Show preview after upload
  uploadedFileChanged = true;
  setTimeout(() => {
      console.log('Uploaded file and show preview');
      loadMediaPreview(window.questionList[currentChosenIndex].type, window.questionList[currentChosenIndex].base64);
  }, 500);
  
});

// When click outside the question, then hide the mediaPreview
$(document).on('click', '.slideList', function () {
  $('.questionMediaPreview').removeClass('questionMediaPreviewActive');
  destroyMediaPreview();
  currentChosenIndex = -1;
  $('.question').removeClass('chosen');
});

// When cancel media file
$(document).on('click', '.mediaCancel', function () {
  window.questionList[currentChosenIndex].base64 = null;
  window.questionList[currentChosenIndex].type = null;
  $('.question .uploadBtn').eq(currentChosenIndex).removeClass('uploaded');
  $('.question .mediaCancel').eq(currentChosenIndex).addClass('d-none');
  destroyMediaPreview();
});


// Test loadQuestion
$(document).ready(function () {

  // For testing purpose
  window.questionList = [
      {
        question: "What is the capital of France?",
        answer: "Paris"
      },
      {
        question: "What is the highest mountain in the world?",
        answer: "Mount Everest"
      },
      {
        question: "What is the largest ocean in the world?",
        answer: "Pacific Ocean"
      }
    ];

    // Comment out this line to disable loadQuestion test
    loadQuestionFromListData();
});

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
$('#question-text').text('✨ Nhấn "😝" để bắt đầu cuộc chơi 🚀🚀🚀');

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
$('#result-text').text('Bạn đã trả lời đúng: ' + rightAnswerNumber + '/' + window.questionList.length);
$('.resultDisplay').removeClass('d-none');
$('.questionDisplay').addClass('resultDisplayPanel transparentBar');
$('.resultTable ').empty();
$('.resultTable').append('<thead><tr><th>Câu hỏi</th><th>Đáp án</th><th>Kết quả</th></tr></thead>');
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
    label: "Câu hỏi " + (idx + 1),
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

// OpenGameSampleHelper.js

function readGameData(sampleName) {
$.getJSON('gameFileData/' + sampleName, function(jsonData) {
    if (jsonData) {
        window.setting = jsonData.setting;
        window.questionList = jsonData.data;
        loadQuestionFromListData();
        setIntro();
        loadBackground();
        $('.countdown').val(window.setting.countdown);
        currentChosenIndex = -1;
        showAlert(SUCCESS_OPEN_SAMPLE_GAME);
    } else {
        showAlert(FAILED_OPEN_SAMPLE_GAME);
    }

}).fail(function() {showAlert(FAILED_OPEN_SAMPLE_GAME)});
}

var getUrlParameter = function getUrlParameter(sParam) {
var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
}
return false;
};

$( document ).ready(function() {
var sampleID = getUrlParameter('sampleID');
console.log('Load game' + sampleID);
if (sampleID) {
  readGameData(sampleID + ".VietEduSoft");
}
});