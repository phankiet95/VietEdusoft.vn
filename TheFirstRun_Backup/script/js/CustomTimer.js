var total;
var timeleft;
function countdownFunction(elementId) {
    window.timerCountdown = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(timerCountdown);
            endGame();
            console.log('Time up');
        }

        $(elementId).text(timeleft);
            timeleft -= 1;
    }, 1000);


};

