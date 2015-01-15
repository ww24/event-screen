/**
 * User Model
 *
 */

var mongoose = require("mongoose");

var libs = require("../libs");

// User スキーマの定義
var schema = new mongoose.Schema({
  id: {
    type: String,
    index: {unique: true},
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: {unique: true},
    required: true
  },
  password: {
    key: String,
    salt: String
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// name getter
var name = schema.virtual("name");
name.get(function () {
  return this.first_name + " " + this.last_name;
});

// user.updatePassword method
schema.method("updatePassword", function (password) {
  var promise = new mongoose.Promise();

  var user = this;

  libs.pwhash.generate(password, function (err, key, salt) {
    if (err) {
      return promise.reject(new Error("pwhash error"));
    }

    user.password = {
      key: key,
      salt: salt
    };

    promise.resolve(null, user.password);
  });

  return promise;
});

// 保存時の処理
schema.pre("save", function (next) {
  // update_at プロパティを現在時刻で更新する。
  this.updated_at = Date.now();

  if (this.password.key && ! this.password.salt) {
    this.updatePassword(this.password.key)
        .then(next.bind(null, null), next);
  } else {
    next();
  }
});

module.exports = mongoose.model("User", schema);
