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

  if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
    return function () {
      element.style.width = size.width;
      element.style.height = size.height;      
      document.webkitCancelFullScreen();
    };
  } else {
    return false;
  }
}
