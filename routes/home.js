const express = require('express');
const router = express.Router();
const {Tag} = require('../models/tag');

router.get('/', async (req, res) => {
  console.log("here");
  const tag = await Tag.find({});
  res.send(tag);
})

router.post('/', async (req, res) => {
  let tag = req.body;

  tag = new Tag({
    name: tag.name
  });

  tag = await tag.save();

  res.send(tag)
})

module.exports = router;