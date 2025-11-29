$(document).ready(function () {
  //media player and record
  let preview = document.getElementById('preview');
  let recording = document.getElementById('recording');
  async function startRecording(stream) {
    let recorder = new MediaRecorder(stream);
    let data = [];
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();
    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = (event) => reject(event.name);
    });
    await Promise.all([stopped]);
    return data;
  }
  function stop(stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  $(document).on('click', '.openRecordVideoModal', function () {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        $('#coverBackground').removeClass('d-none').attr('type', 'video');
        $('#recVideoModal').removeClass('d-none').attr('questionid', $(this).parents('.question').index());
        preview.srcObject = stream;
        preview.captureStream = preview.captureStream || preview.mozCaptureStream;
        return new Promise((resolve) => (preview.onplaying = resolve));
      });
  });
  $(document).on('click', '#recVideo', function () {
    $(this).toggleClass('d-none');
    $('.recordingIcon').removeClass('d-none');
    startRecording(preview.captureStream()).then((recordedChunks) => {
      let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
      recording.src = URL.createObjectURL(recordedBlob);
      var reader = new FileReader();
      reader.readAsDataURL(recordedBlob);
      reader.onloadend = function () {
        var base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
        slideData.data[$('#recVideoModal').attr('questionid')].file = { type: 'video', base64 };
      };
    });
  });
  $(document).on('click', '#stopRecVideo', function () {
    stop(preview.srcObject);
    $('.recordingIcon').addClass('d-none');
    $('#recording').toggleClass('d-none');
    $('#preview').toggleClass('d-none');
    $('.recBtn').toggleClass('d-none');
    $('.stopBtn').toggleClass('d-none');
    $('#questionList > .question').eq($('#recVideoModal').attr('questionid')).find('.fileName').html('Bản ghi hình');
  });
  //Close record modal
  $(document).on('click', '#coverBackground', function () {
    if ($(this).attr('type') == 'video') {
      stop(preview.srcObject);
      $('.recordingIcon').addClass('d-none');
      if (!$('#recording').hasClass('d-none')) $('#recording').addClass('d-none');
      if ($('#preview').hasClass('d-none')) $('#preview').removeClass('d-none');
      $('#coverBackground').addClass('d-none');
      $('#recVideoModal').addClass('d-none');
    }
    if ($(this).attr('type') == 'audio') {
      if (preStreamAudio.srcObject != null) stop(preStreamAudio.srcObject);
      if (!$('#recordedAudio').hasClass('d-none')) $('#recordedAudio').addClass('d-none');
      $('#coverBackground').addClass('d-none');
      $('#recAudioModal').addClass('d-none');
    }
    if ($('.recBtn').hasClass('d-none')) $('.recBtn').removeClass('d-none');
    if ($('.startBtn').hasClass('d-none')) $('.startBtn').removeClass('d-none');
    if ($('.stopBtn').hasClass('d-none')) $('.stopBtn').removeClass('d-none');
  });
  //audio record
  let preStreamAudio = document.getElementById('preStreamAudio');
  let recordedAudio = document.getElementById('recordedAudio');
  function startRecAudio(stream) {
    let recorder = new MediaRecorder(stream);
    let data = [];
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();
    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = (event) => reject(event.name);
    });
    return Promise.all([stopped]).then(() => data);
  }
  $(document).on('click', '.openRecordAudioModal', function () {
    $('#coverBackground').removeClass('d-none').attr('type', 'audio');
    $('#recAudioModal').removeClass('d-none').attr('questionid', $(this).parents('.question').index());
  });
  $(document).on('click', '#recAudio', function () {
    let id = $(this).parent()[0].getAttribute('questionid');
    $(this).toggleClass('d-none');
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        preStreamAudio.srcObject = stream;
        startRecAudio(stream).then((recordedChunks) => {
          let recordedBlob = new Blob(recordedChunks, { type: 'audio/mp3' });
          recordedAudio.src = URL.createObjectURL(recordedBlob);
          var reader = new FileReader();
          reader.readAsDataURL(recordedBlob);
          reader.onloadend = function () {
            var base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
            slideData.data[id].file = { type: 'audio', base64 };
          };
        });
      });
  });
  $(document).on('click', '#stopRecAudio', function () {
    stop(preStreamAudio.srcObject);
    $('#recordedAudio').toggleClass('d-none');
    $('.recBtn').toggleClass('d-none');
    $('.stopBtn').toggleClass('d-none');
    $('#questionList > .question').eq($('#recAudioModal').attr('questionid')).find('.fileName').html('Bản ghi âm');
  });
});