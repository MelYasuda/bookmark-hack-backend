const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if(user) return res.status(400).send('User already exists');

  const {name, email, password} = req.body;
  user = new User({
    name: name,
    email: email,
    password: password
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password,salt);
  
  await user.save();

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
  
})

module.exports = router;