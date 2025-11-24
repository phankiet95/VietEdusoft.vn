

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
  let dataSaved = JSON.stringify({ data: window.questionList, setting });
  download(`${window.setting.gameinfo.name}_${getTimeForFileName()}.VietEduSoft`, dataSaved);

  setTimeout(() => {
    window.isLoading(false);
  }, 1000)

});

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
                setIntro();
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
          setIntro();
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

