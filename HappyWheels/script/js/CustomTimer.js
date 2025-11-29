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
