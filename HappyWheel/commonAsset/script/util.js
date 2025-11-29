window.toBase64 = (file, onload) => {
  var reader = new FileReader();
  reader.onload = function () {
    var base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
    onload(base64);
  };
  reader.readAsDataURL(file);
};
window.download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
Array.prototype.shuffle = function () {
  let m = this.length,
    i;
  while (m) {
    i = (Math.random() * m--) >>> 0;
    [this[m], this[i]] = [this[i], this[m]];
  }
  return this;
};
window.animateCSS = (node, animation, func = () => {}, option = '', prefix = 'animate__') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const optionName = `${prefix}${option}`;
    node.addClass([`${prefix}animated`, animationName, optionName]);
    /* When the animation ends, we clean the classes and resolve the Promise */
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.removeClass([`${prefix}animated`, animationName, optionName]);
      func();
      resolve('Animation ended');
    }
    node[0].addEventListener('animationend', handleAnimationEnd, { once: true });
  });

window.obfuscate = (codeText) => {
  const options = {
    compact: false,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1
  };
  const obfuscationResult = JavaScriptObfuscator.obfuscate(codeText, options);

  return obfuscationResult.getObfuscatedCode();
}

window.toDataURL = (url, callback) => {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

window.toTextFromUrl = (url, callback) => {
  $.ajax({
    type: "GET",
    contentType: "application/text",
    url: url,
    dataType: 'text',
    cache: false,
    success: function (data) {
      callback(data)
    },
    error: function (e) {
    }
  });
}

function showAlert(alertText) {
  Swal.fire({
    icon: 'info',
    title: 'Thông báo',
    text: alertText
  });
  $("body").removeClass("swal2-height-auto");
}

function getTimeForFileName() {
  let newDate = new Date();
  let strTime = newDate.toLocaleDateString().replace('/','-') + ' ' + newDate.toLocaleTimeString().replace(':','-');
  console.log('strTime', strTime);
  return strTime;
}

// Need to test this
// $(window).on("load", function() {
//   window.isLoading(true);
// });

// $(document).ready(function() {
//   window.isLoading(false);
// });

function toggle_full_screen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
    }
    else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen();
    }
    else if (document.documentElement.webkitRequestFullScreen) {   /* Chrome, Safari & Opera */
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    else if (document.msRequestFullscreen) { /* IE/Edge */
        document.documentElement.msRequestFullscreen();
    }
  } else {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    }
    else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {   /* Chrome, Safari and Opera */
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
  }
}