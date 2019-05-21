const express = require('express');
const router = express.Router();
const {Tag} = require('../models/tag');
const {User} = require('../models/user');

router.get('/', async (req, res) => {
  console.log(req.user._id)
  const user = await User.findById(req.user._id);
  if(!user) return res.status(400).send('Invalid user id');

  const tags = await user.tags;
  res.send(tags);
})

// Getting all the global tags might slow it down, narrow it down
router.get('/suggestionTags', async (req, res) =>{
  const tags = await Tag.find({})
  res.send(tags);
})

router.post('/homeTags', async (req, res) =>{
  let body = req.body;

  const user = await User.findById(req.user._id);
  if(!user) return res.status(400).send('Invalid user id');

  user.tags=body.tags;
  await user.save();

  res.send();
})

router.post('/', async (req, res) => {
  let body = req.body;
  console.log(req);

    let tag = new Tag({
      name: req.body.name
    });
    tag.id = tag.id;
    await tag.save();

  res.send();
})

module.exports = router;