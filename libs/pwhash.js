/**
 * PBKDF2 wrapper
 */

var crypto = require("crypto");

var iterations = 10000;
var keylen = 32;
var encoding = "hex";

exports.generate = function (passwd, done) {
  crypto.pseudoRandomBytes(keylen, function (err, salt) {
    crypto.pbkdf2(passwd, salt, iterations, keylen, function (err, key) {
      done(err || null, key.toString(encoding), salt.toString(encoding));
    });
  });
};

exports.verify = function (org_key, salt, passwd, done) {
  salt = new Buffer(salt, encoding);

  crypto.pbkdf2(passwd, salt, iterations, keylen, function (err, key) {
    done(err || null, org_key === key.toString(encoding));
  });
};
