const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');


router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  passport.authenticate('local', {session: false, successRedirect: '/api/home'}, (err, user, info)=> {

    if (err || !user) {
      console.log(err)
      return res.status(400).json({
        message: err,
        user: user
      })
    }
    req.login(user, {session: false}, (err)=>{
      if (err) {
        res.send(err);
      }
      const userValueToSend = (({email, name, _id}) => ({email, name, _id}))(user);
      const token = user.generateAuthToken();
      return res.json({userValueToSend, token });
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