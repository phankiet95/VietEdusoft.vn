var total;
var timeleft;
function countdownFunction(elementId) {
    console.log('Start Timer');
    window.timerCountdown = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(timerCountdown);
            //endGame();
            timeUp();
            console.log('Time up');
        }

        $(elementId).text(timeleft);
            timeleft -= 1;
    }, 1000);


};

