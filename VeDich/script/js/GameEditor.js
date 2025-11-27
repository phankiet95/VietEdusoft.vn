// GameEditor.js: This script is for editting question

window.questionList = [];
let currentChosenIndex = 0;
var uploadedFileChanged = false;

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
    $('.question').eq(0).before('<div><span>Gói câu hỏi 60 điểm</span></div>');
    $('.question').eq(3).before('<div><span>Gói câu hỏi 90 điểm</span></div>');
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
          audio_runTime.volume = 0.1;
          break;
        case CONST_AUDIO:
          $('#PreviewquestionMedia_audio').attr('src', src);
          $('#PreviewquestionMedia_audio').removeClass('d-none');
          audio_runTime.volume = 0.1;
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
    if (currentChosenIndex >= 1 && currentChosenIndex <= 3) {
        currentChosenIndex = currentChosenIndex - 1;
      }
    if (currentChosenIndex >= 5 && currentChosenIndex <= 7) {
    currentChosenIndex = currentChosenIndex - 2;
    }
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
          question: "Gói 60: Câu hỏi số 1",
          answer: "Đáp án"
        },
        {
          question: "Gói 60: Câu hỏi số 2",
          answer: "Đáp án"
        },
        {
          question: "Gói 60: Câu hỏi số 3",
          answer: "Đáp án"
        },
        {
          question: "Gói 90: Câu hỏi số 1",
          answer: "Đáp án"
        },
        {
          question: "Gói 90: Câu hỏi số 2",
          answer: "Đáp án"
        },
        {
          question: "Gói 90: Câu hỏi số 3",
          answer: "Đáp án"
        }
      ];

      // Comment out this line to disable loadQuestion test
      loadQuestionFromListData();
});