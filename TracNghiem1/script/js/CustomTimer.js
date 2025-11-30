var total;
var timeleft;
function countdownFunction(elementId, isEachQuestion) {
    window.timerCountdown = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(timerCountdown);
            
            if (!isEachQuestion) { // Nếu không phải là đếm ngược cho từng câu hỏi
                console.log('Hết thời gian');
                endGame();
            } else {
                // Xử lý khi hết thời gian cho từng câu hỏi
                console.log('Hết thời gian cho câu hỏi này');
                $(elementId).text(0);
                clearInterval(window.timerCountdown);
                return;
            }

            console.log('Time up');
        }

        $(elementId).text(timeleft);
            timeleft -= 1;
    }, 1000);


};

