/**
 * User Route
 *
 */

var express = require("express");
var router = express.Router();

var validator = require("validator");

var models = require("../models");

// GET /user のルート
router.get("/", function (req, res) {
  // views/home.html をテンプレートとして読み込んで返す
  res.render("user");
});

// POST /user のルート
router.post("/", function (req, res) {
  var password = req.body.pass;
  var confirm = req.body.pass_confirm;

  // validate
  if (! validator.isLength(password, 8)) {
    return res.status(400).json({
      status: "ng",
      message: "パスワードは8文字以上で設定してください。"
    });
  }

  if (password !== confirm) {
    return res.status(400).json({
      status: "ng",
      message: "確認用のパスワードが間違っています。"
    });
  }

  models.User.findOne({
    id: req.user.id
  }).exec().then(function (user) {
    return user.updatePassword(password);
  }).then(function () {
    if (req.xhr) {
      res.json({
        status: "ok"
      });
    } else {
      // GET /user へリダイレクト
      res.redirect("/user");
    }
  }, function (err) {
    console.error(err);
    res.status(500).json({
      status: "ng",
      message: "database error"
    });
  });
});

module.exports = router;
