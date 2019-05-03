const express = require('express');
const router = express.Router();
const {Bookmark,validate} = require('../models/bookmark');
const {User} = require('../models/user');

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  // look up user
  const userId = req.user._id;

  const user = await User.findById(userId);
  if(!user) return res.status(400).send('Invalid user id');

  console.log(user)

  const {url, name, tags} = req.body;

  let bookmark = new Bookmark({
    user: {
      id: user._id,
      name: user.name
    },
    url: url,
    title: title,
    tags: tags
  });

  bookmark = await bookmark.save();

  res.send(bookmark)
});

module.exports = router;