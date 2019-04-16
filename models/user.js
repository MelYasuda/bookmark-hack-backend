const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxlength: 50
  },
  email: {
    type: String,
    require: true,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 1024
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validate(user) {
  const schema = {
    name: Joi.string().max(50).required(),
    email: Joi.string().max(225).required().email(),
    password: Joi.string().min(6).max(225).required()
  }

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;