const mongoose = require('mongoose');
const Joi = require('joi');
const {userSchema} = require('../models/user');

const bookmarkSchema = new mongoose.Schema({
  user: {
    name: {
      type: String,
      required: true,
      maxlength: 50
    },
    _id: {
      type: String,
      required: true,
      maxlength: 50
    }
  },
  url: {
    type: String,
    required: true,
    maxlength: 1000
  },
  title: {
    type: String,
    maxlength: 500,
    required: true
  },
  desc: {
    type: String,
    maxlength: 500
  },
  image: {
    type: String,
    maxlength: 500,
  },
  tags: {
    type: Array,
    required: true,
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
  remind: {
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
    title: Joi.string().max(100).required(),
    tags: Joi.array().max(100).required(),
    unfinished: Joi.boolean(),
    important: Joi.boolean(),
    remind: Joi.boolean(),
    note: Joi.string().allow('').max(1000)
  }

  return Joi.validate(bookmark, schema)
}

exports.Bookmark = Bookmark;
exports.validate = validate;