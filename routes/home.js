const express = require('express');
const router = express.Router();
const {Tag} = require('../models/tag');

router.get('/', async (req, res) => {
  const tag = await Tag.find({});
  res.send(tag);
})

router.post('/', async (req, res) => {
  let body = req.body;
  console.log(req);

  body.tags.forEach( async name => {
    let tag = new Tag({
      name: name
    });
    await tag.save();
  });

  res.send()
})

module.exports = router;