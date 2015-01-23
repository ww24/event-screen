/**
 * sound player
 *
 */
/* globals AudioContext */

function Sound(url) {
  var sound = this;

  this.ctx = new AudioContext();
  this._promise = Sound.loadSoundFile(url).then(function (res) {
    return new Promise(function (resolve, reject) {
      sound.ctx.decodeAudioData(res, resolve, reject);
    });
  });
}

Sound.loadSoundFile = function (url) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open("get", url, true);
    req.responseType = "arraybuffer";
    req.onload = function () {
      resolve(req.response);
    };
    req.onerror = reject;
    req.send();
  });
};

Sound.prototype.play = function (time) {
  var sound = this;
  return this._promise.then(function (buff) {
    var source = sound.ctx.createBufferSource();
    source.buffer = buff;
    source.connect(sound.ctx.destination);
    source.start(time || 0);
  });
};
