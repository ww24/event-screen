/**
 * Channel Model
 *
 */

var mongoose = require("mongoose");

// Channel Schema definition
var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Source"
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

// 保存時の処理
schema.pre("save", function (next) {
  this.updated_at = Date.now();

  next();
});

module.exports = mongoose.model("Channel", schema);
