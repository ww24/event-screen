/**
 * Fullscreen API wrapper
 * ※エンドユーザの click イベントから呼び出さないと動きません
 */
/* exported fullscreen */

function fullscreen(element) {
  var size = {
    width: element.style.width,
    height: element.style.height
  };

  element.style.width = screen.width + "px";
  element.style.height = screen.height + "px";

  var requestFullScreen = element.RequestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen;

  if (requestFullScreen) {
    requestFullScreen.call(element);
    return function () {
      element.style.width = size.width;
      element.style.height = size.height;
      fullscreen.cancel();
    };
  } else {
    return false;
  }
}

fullscreen.check = function () {
  return document.isFullScreen || document.webkitIsFullScreen || document.mozFullScreen;
};

fullscreen.cancel = function () {
  var cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen;
  if (cancelFullScreen) {
    cancelFullScreen.call(document);
    return true;
  } else {
    return false;
  }
};
