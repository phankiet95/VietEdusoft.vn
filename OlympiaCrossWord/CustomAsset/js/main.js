
//Handle add new question
function addQuestion(object) {
  let last = slideData.data.length + 1;

  $('#questionList').append(window.questionPanel.replace('<strong>1</strong>', `<strong>${last}</strong>`));

  $('#slideList').append('<div class="input-group mr-sm-2 slideItem"></div>');
  if (typeof object == 'undefined') slideData.data = [...slideData.data, { question: '', answer: '', keyChar: -1, file: null }];

  typeof object != 'undefined' && $('#questionList>.question').eq(object.id).find('.inputQuestion').val(object.question);
  if ($('#questionList>.question').length > 1) {
    $('#btnDelQuestion').removeAttr('disabled');
  }
}

//Handle add new question load form file
function addQuestionFromFile(object, number) {
  let last = number;

  $('#questionList').append(window.questionPanel.replace('<strong>1</strong>', `<strong>${last}</strong>`));

  $('#slideList').append('<div class="input-group mr-sm-2 slideItem"></div>');
  if (typeof object == 'undefined') slideData.data = [...slideData.data, { question: '', answer: '', keyChar: -1, file: null }];

  typeof object != 'undefined' && $('#questionList>.question').eq(object.id).find('.inputQuestion').val(object.question);
  if ($('#questionList>.question').length > 1) {
    $('#btnDelQuestion').removeAttr('disabled');
  }
}

function getTimeForFileName() {
  let newDate = new Date();
  let strTime = newDate.toLocaleDateString().replace('/','-') + ' ' + newDate.toLocaleTimeString().replace(':','-');
  console.log('strTime', strTime);
  return strTime;
}

$(document).ready(function () {
  // initial
  addQuestion();
  $('#slideList').css('font-family', slideData.font.fontFamily);
  $('#slidePage').css('font-family', slideData.font.fontFamily);

  $('#btnAddQuestion').bind({
    click: function () {
      addQuestion();
    },
  });

    //Process when delete button clicked to delete from last question
    $('#btnDelQuestion').bind({
      click: function () {
        let currentLenght = $('#questionList>.question').length;
        console.log(currentLenght);
        if (currentLenght > 1) {
            //$('#questionList .question').slice(-1).remove();
            //$('#slideList .slideItem').slice(-1).remove();
            $('#questionList .question').last().remove();
            $('#slideList .slideItem').last().remove();
            $('#slidePage .slideItem').last().remove();
  
  
            currentLenght -= 1;
            slideData.data.splice(-1);
            console.log($('#questionList .question').length);
            console.log($('#slideList .slideItem').length);
            console.log($('#slidePage .slideItem').length);
  
            console.log(slideData.data.length);
  
            updateSlideView();
        }
        if (currentLenght == 1) {
          $('#btnDelQuestion').attr('disabled', 'disabled');
        }
      },
    });
    
});




  //Process inputs from user and render a word
  $(document).on('input', '.question .inputQuestion', function () {
    slideData.data[$(this).parents('.question').index()].question = $(this).val();
  });
  function typingAnswer(input, object) {
    let { data } = slideData;
    let { fontSize } = slideData.font;
    let { color, bgColor, keyColor } = slideData.setting.cell;
    let selected = object.parents('.question').index();
    var selector = $('#slideList>.slideItem').eq(selected);
    selector.empty();
    data[selected].answer = input;
    for (let index = 0; index < input.length; index++) {
      let initStyle = `${input[index] == ' ' ? ' opacity: 0;' : ''} background-color: ${bgColor}; color: ${color};`;
      selector.append(answerPanel.replace(/(.+?:\s)(px.+?:\s)(px.+?:\s)(px.+?:\s)(.+?;)(.+)(<\/strong>.+)/, `$1${cellSize}$2${cellSize}$3${cellSize}$4${fontSize}$5${initStyle}$6${input[index]}$7`));
      if (data[selected].keyChar == index) {
        selector.children('.input-group-text').eq(index).css('background-color', keyColor).addClass('key');
      }
    }
  }
  $(document).on('input', '.question .inputAnswer', function () {
    typingAnswer($(this).val(), $(this));
  });
  function updateSlideView(object) {
    let { fontFamily, fontSize } = slideData.font;
    let { second } = slideData.setting.countdown;
    let { color, bgColor, keyColor } = slideData.setting.cell;

    if (object == 'loadFile') {
      $('#questionList, #slideList, #slidePage .slideItem').empty();
      let currentNumer = 0;
      slideData.data.forEach((el, id) => {
        currentNumer++;
        addQuestionFromFile({ ...el, id },currentNumer);
        $('#questionList .question').eq(id).find('.inputAnswer').val(el.answer);
        for (let i = 0; i < el.answer.length; i++) {
          typingAnswer(el.answer, $('#questionList .question').eq(id).find('.inputAnswer'));
        }
      });
      $('#fontFamily').val(fontFamily);
      $('#fontSize').val(fontSize);
      changeFontFamily(fontFamily);
      changeFontSize(fontSize);

      let { color } = slideData.setting.background;
      $('#slideList, #backgroundColorLayer').css('background-image', `linear-gradient(to right, ${color[0]}, ${color[1]})`);

      if (slideData.setting.background.colorMoving) {
        $('#backgroundColorLayer').addClass('moving');
      }

      let opac = slideData.setting.background.colorOverlayOpacity + '%';
      $('#backgroundColorLayer').css('Opacity',opac);
      $('#countdown').text(second);
      $('#countdown_media').text(second);
      $('#setupPanel .basic .countdown').val(second);
      $('#setupPanel .color').val(color);
      $('#setupPanel .bgColor').val(bgColor);
      $('#setupPanel .keyColor').val(keyColor);

    }
    if (typeof object == 'object') {
      object.siblings().removeClass('key');
      object.addClass('key');
      //change color
      if (object.parents('#slideList').length > 0) {
        object.siblings('.slideItem > .input-group-text').each(function () {
          $(this).css('background-color', bgColor);
        });
        object.css('background-color', keyColor);
      }
      let idRow = object.parents('.slideItem').index();
      slideData.data[idRow].keyChar = object.index();
    }
    $('#slideList .input-group-text').css({
      lineHeight: cellSize + 'px',
      height: cellSize + 'px',
      width: cellSize + 'px',
      fontSize: fontSize + 'px',
    });
  }
  //Process when you select key character on a row
  $(document).on('click', '#slideList .slideItem > .input-group-text', function () {
    updateSlideView($(this));
  });
  //download file from web
  function download(filename, text) {
    console.log('filedownload 1');
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    $('#fordownload').append(element);
    //document.body.appendChild(element);
    console.log('filedownload 2');
    element.click();
    console.log('filedownload 3');
    $('#fordownload').empty(element);
    //document.body.removeChild(element);
    console.log('filedownload 4');
  }
  //generate html file for slide
  function generateHtml() {
    let html = $('html').clone();
    html.find('#slidePage .input-group-text .show').removeClass('show');
    html.find('#qInfo').removeAttr('questionid');
    html.find('link[rel="stylesheet"], body>:not(#slideWrapPage):not(#backgroundSlideVideo):not(#qInfoWrap):not(#backgroundSound), script:not([type="text/javascript"])').remove();
    html.find('#slidePage').append(`<p id="slideDataTxt" class="d-none">${JSON.stringify(slideData)}</p>`);
    html.find('#slideWrapPage').css('height', '');
    download(
      'Crossword.html',
      html
        .wrapAll('<div>')
        .parent()
        .html()
        .replace(/<!.+-->/g, '')
    );
  }

  $(document).on('click', '#exportHtml', function () {
    $('#loading').removeClass('d-none');
    generateHtml();
  });

  $(document).on('click', '#nav_exportGame', function () {
    console.log('Start download Data');
    // Lưu game Intro
    //saveIntro();
    let dataSaved = JSON.stringify({ data: window.slideData });
    download(`${window.slideData.setting.gameinfo.name}_${getTimeForFileName()}.VietEduSoft`, dataSaved);
  
  });

  // kiet new add
  $(document).on('change', '#nav_importGame', function () {
    console.log('Start download Data');
    var file = $(this)[0].files[0];
    $(this).val(null);
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = () => {
      let jsonData = JSON.parse(reader.result);
      // If setting.gameinfo.name from File equal to gameinfoName in GameEditor.js
      if (jsonData.data.setting.gameinfo.name === window.slideData.setting.gameinfo.name) {
        window.slideData.setting = jsonData.data.setting;
        window.slideData.data = jsonData.data.data;
        //loadQuestionFromListData();
        updateSlideView('loadFile');
        $('#countdown').text(window.slideData.setting.countdown.second);
        $('#countdown_media').text(window.slideData.setting.countdown.second);
        $('#config_countdown').val(window.slideData.setting.countdown.second);

        $('#colorOverlayRange').val(window.slideData.setting.background.colorOverlayOpacity);
        $('#backgroundColorLayer').css('Opacity',(window.slideData.setting.background.colorOverlayOpacity/100).toString());

        $('#textureEffectRange').val(window.slideData.setting.background.textureEffectOpactity);
        $('#backgroundAnimationLayer').css('Opacity',(Number(window.slideData.setting.background.textureEffectOpactity)/100).toString());

        // Re-apply Background Media
        destroyMedia();
        if (slideData.setting.customBackground.type.includes('video')) {
            console.log('Load background Video');
            $('#backgroundSlideVideo').attr('src',`data:video/mp4;base64,${slideData.setting.customBackground.base64}`);
            slideData.setting.background.type = 'video';
            slideData.setting.customBackground.type = 'video';
        } else

        if (slideData.setting.customBackground.type.includes('image')) {
            console.log('Load background image');
            setBackgroundPicture('#backgroundPictureLayer', slideData.setting.customBackground.base64);
            slideData.setting.background.type = 'image';
            slideData.setting.customBackground.type = 'image';

        }

        if (slideData.setting.customMusic.type.includes('music')) {
          $(currentTab+ ' #backgroundSlideAudio').attr('src',`data:audio/ogg;base64,${slideData.setting.customMusic.base64}`);

        }


      } else {
      }
    }
  
  });


  function changeFontFamily(object) {
    slideData.font.fontFamily = object;
    $('#slideList').css('font-family', object);
    $('#slidePage').css('font-family', object);
    $('#qInfo').css('font-family', object);
    updateSlideView();
  }
  $(document).on('change', '#fontFamily', function () {
    changeFontFamily($(this).val());
  });
  function changeFontSize(object) {
    slideData.font.fontSize = parseInt(object);
    cellSize = parseInt(slideData.font.fontSize + 10);
    updateSlideView();
  }
  $(document).on('change', '#fontSize', function () {
    changeFontSize($(this).val());
  });
  //open html file
  $(document).on('change', '#openHtml', function () {
    var file = $(this)[0].files[0];
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function () {
      slideData = JSON.parse($(reader.result).find('#slideDataTxt').text());
      $('#slideDataTxt').remove();
      updateSlideView('loadFile');
    };
  });
  // Click on navigator panel item - create Page
  $(document).on('click', '#nav_composerPanel', function () {
    let slidePage = $('#slidePage').children('.slideItem').clone();
    slidePage.find('.qNo').remove();
    $('#slideList').html(slidePage);
  });
  // Click on navigator panel item - slide Page
  $(document).on('click', '#nav_slideshowPanel', function () {
    let slideList = $('#slideList').children('.slideItem');
    let slidePage = $('#slidePage').children('.slideItem').clone();
    slidePage.find('.qNo').remove();
    let theSame = true;
    slideList.each(function (index) {
      if ($(this).html() != slidePage.eq(index).html()) {
        theSame = false;
        return false;
      }
    });
    if (!theSame) {
      $('#slidePage .slideItem').remove();
      $('#slidePage').prepend($('#slideList').children().clone());
      $('#slidePage .slideItem').each(function (index, element) {
        $(element).prepend(answerPanel.replace('input-group-text', 'qNo').replace(/(.+?:\s)(px.+?:\s)(px.+?:\s)(px.+?:\s)(.+?;)(.+)(<\/strong>.+)/, `$1${cellSize}$2${cellSize}$3${cellSize}$4${slideData.font.fontSize}$5$6${parseInt(index + 1)}$7`));
        $(element).find('.qNo').removeClass('d-none');
      });
    }
  });

  $('body').on('change', '#setupPanel .basic .countdown', function () {
    $('#countdown').text($(this).val());
    $('#countdown_media').text($(this).val());
    slideData.setting.countdown.second = $(this).val();
  });

