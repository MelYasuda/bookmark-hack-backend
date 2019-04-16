const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
require('./passport');


const home = require('./routes/home');
const users = require('./routes/users');
const auth = require('./routes/auth');

mongoose.connect('mongodb://localhost/boomarkhack')
  .then(()=>console.log('connected to MongoDB'))
  .catch(()=>console.error('failed to connect to DB'));

app.use(express.json());
app.use('/api/home', passport.authenticate('jwt', {session: false}), home);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening to ${port}`))