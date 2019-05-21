const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
require('./passport');

const splash = require('./routes/splash');
const tags = require('./routes/tags');
const users = require('./routes/users');
const auth = require('./routes/auth');
const bookmarks = require('./routes/bookmarks');
const config = require('config');

mongoose.connect(config.get('db'))
  .then(()=>console.log('connected to MongoDB'))
  .catch(()=>console.error('failed to connect to DB'));

app.use(express.json());
app.use('/api/', splash);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/tags', tags);
app.use('/api/bookmarks', passport.authenticate('jwt', {session: false}), bookmarks);

app.get('/logout', (req, res) => {
  console.log('logout')
  req.logout();
  return res.send('logged out')
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening to ${port}`))