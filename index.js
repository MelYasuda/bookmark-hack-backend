const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
require('./passport');

const splash = require('./routes/splash');
const home = require('./routes/home');
const users = require('./routes/users');
const auth = require('./routes/auth');
const bookmarks = require('./routes/bookmarks');

mongoose.connect('mongodb://localhost/boomarkhack')
  .then(()=>console.log('connected to MongoDB'))
  .catch(()=>console.error('failed to connect to DB'));

app.use(express.json());
// app.use((req, res, next)=>{
//   res.locals.isAuthenticated = req.headers.authorization ? true : false;
//   next();
// });
app.use('/api/', splash);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/home', passport.authenticate('jwt', {session: false}), home);
app.use('/api/bookmarks', passport.authenticate('jwt', {session: false}), bookmarks);

app.get('/logout', (req, res) => {
  console.log('logout')
  req.logout();
  return res.send('logged out')
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening to ${port}`))