const mongoose = require('mongoose');
const Joi = require('joi');
const {userSchema} = require('../models/user');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    require: true
  },
  url: {
    type: String,
    require: true,
    maxlength: 1000
  },
  title: {
    type: String,
    require: true,
    maxlength: 500
  },
  tags: {
    type: Array,
    require: true,
    maxlength: 100
  },
  unfinished: {
    type: Boolean,
    required: true,
    default: false
  },
  important: {
    type: Boolean,
    required: true,
    default: false
  },
  remindMeLater: {
    type: Boolean,
    default: false,
    dateToRemind: Date
  },
  note: {
    type: String
  }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

function validate(bookmark) {
  const schema = {
    url: Joi.string().max(1000).required(),
    title: Joi.string().max(500),
    tags: Joi.array().max(100).required(),
    unfinished: Joi.boolean(),
    important: Joi.boolean(),
    remindMeLater: Joi.boolean()
  }

  return Joi.validate(bookmark, schema)
}

exports.Bookmark = Bookmark;
exports.validate = validate;