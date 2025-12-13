// Lưu game Intro
function saveIntro() {
  window.setting.gameIntro.gameIntro_title = $('#gameIntro_title').text();
  window.setting.gameIntro.gameIntro_detail = $('#gameIntro_detail').text();
}

// Get game Intro
function setIntro() {
  $('#gameIntro_title').text(window.setting.gameIntro.gameIntro_title);
  $('#gameIntro_detail').text(window.setting.gameIntro.gameIntro_detail);
}

$(document).on('click', '#exportDataFile', function () {
  console.log('Start download Data');
  window.isLoading(true);
  // Lưu game Intro
  saveIntro();
  let dataSaved = JSON.stringify({ data: window.questionList, setting, slideintro: window.slideintro  });
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
  document.body.removeChild(link); // Xóa link sau khi tải
  URL.revokeObjectURL(link.href);  // Giải phóng bộ nhớ
}

$(document).on('change', '#importHtml', function () {
  try {
    var file = $(this)[0].files[0];
    $(this).val(null);
    let extension = file.name.split(".").pop();
    console.log('File extension: ', extension);
    if (extension == 'VietEduSoft') {
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
          window.slideintro = jsonData.slideintro;
          loadQuestionFromListData();
          setIntro();
          loadBackground();
          $('.countdown').val(window.setting.countdown);
          $('.countdownOthers').val(window.setting.countdownOthers);
          currentChosenIndex = -1;
          showAlert(SUCCESS_IMPORT_GAME);
          const hideQuestionListBtn = document.getElementsByClassName('hideQuestionList')[0];
          if (hideQuestionListBtn.classList.contains('active') === true) {
            hideQuestionListBtn.click();
          }
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
  if (setting.background == undefined) return;
  if (setting.background && setting.background.type.includes('video')) {
    $('.slideList')[0].style.removeProperty('background-image');
    player.setAttribute('src', setting.background.base64);
  } else if (setting.background && setting.background.type.includes('image')) {
    player.removeAttribute('src');
    $('.slideList').css('background-image', 'url(' + setting.background.base64 + ')');
  }
}