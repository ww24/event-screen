/**
 * Auth Route
 *
 */

var express = require("express");
var router = express.Router();

var libs = require("../libs");
var models = require("../models");

var passport = require("passport");
var GoogleStrategy = require("passport-google").Strategy;
var LocalStrategy = require("passport-local").Strategy;
var config = require("config");

// passport の設定
passport.use(new GoogleStrategy(config.google, function (id, profile, done) {
  var user = {
    id: id,
    first_name: profile.name.givenName,
    last_name: profile.name.familyName,
    email: profile.emails[0].value
  };

  console.info(user);

  done(null, user);
}));

// パスワード認証用の設定
passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "pass"
}, function (email, password, done) {
  models.User.findOne({
    email: email
  }).exec(function (err, user) {
    if (err) {
      return done(err);
    }

    if (! user) {
      return done(new Error("user not found"));
    }

    if (! user.password || ! user.password.key || ! user.password.salt) {
      return done(new Error("should be set password"));
    }

    libs.pwhash.verify(user.password.key, user.password.salt, password, function (err, result) {
      if (err) {
        return done(err);
      }

      if (! result) {
        return done(new Error("invalid password"));
      }

      user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      };

      done(null, user);
    });
  });
}));

// user object -> id 変換
passport.serializeUser(function (user, done) {
  models.User.findOneAndUpdate({id: user.id}, user, {upsert: true}, function (err, user) {
    done(err, user.id);
  });
});

// id -> user object 変換
passport.deserializeUser(function (id, done) {
  models.User.findOne({id: id}).exec(done);
});

// 認証ページ
router.get("/", passport.authenticate("google"));

// 認証コールバックページ
router.get("/callback", passport.authenticate("google", {
  // 成功時のリダイレクトページ
  successRedirect: "/admin",
  // 失敗時のリダイレクトページ
  failureRedirect: "/auth/fail"
}));

// パスワード認証
router.post("/password", passport.authenticate("local", {
  // 成功時のリダイレクトページ
  successRedirect: "/admin",
  // 失敗時のリダイレクトページ
  failureRedirect: "/auth/fail"
}));

// 認証失敗ページ
router.get("/fail", function (req, res) {
  res.render("error", {
    message: "認証に失敗しました。"
  });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
