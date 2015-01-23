/**
 * twitter source
 *
 */

var models = require("../../models"),
    Twitter = require("node-tweet-stream"),
    config = require("config");

module.exports = function (word, channel) {
  var io = this;

  var twitter = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    token: config.twitter.token,
    token_secret: config.twitter.token_secret
  });

  twitter.on("error", function (err) {
    console.error(err);
  });

  twitter.on("tweet", function (tweet) {
    io.to(channel).emit("tweet", tweet);
  });

  twitter.track(word);
};
