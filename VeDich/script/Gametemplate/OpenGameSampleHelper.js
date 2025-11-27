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
        readGameData(sampleID);
    }
});