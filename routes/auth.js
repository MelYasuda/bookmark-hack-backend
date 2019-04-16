const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const passport = require('passport');

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // let user = await User.findOne({email: req.body.email});
  // if(!user) return res.status(400).send('Email or password is invalid');

  // const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  // if(!isPasswordValid) return res.status(400).send('Email or password is invalid');

  passport.authenticate('local', {session: false}, (err, user, info)=> {
    if (err || !user) {
      return res.status(400).json({
        message: err,
        user: user
      })
    }
    req.login(user, {session: false}, (err)=>{
      if (err) {
        res.send(err);
      }
      const token = user.generateAuthToken();
      return res.json({user, token });
    });
  })(req,res); 
});

function validate(user) {
  const schema = {
    email: Joi.string().max(225).required().email(),
    password: Joi.string().min(6).max(225).required()
  }

  return Joi.validate(user, schema)
}

module.exports =router;