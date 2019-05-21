const express = require('express');
const router = express.Router();
const {Bookmark,validate} = require('../models/bookmark');
const {User} = require('../models/user');
const {Tag} = require('../models/tag')

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
  require('metascraper-publisher')(),
]);

const got = require('got');

router.get('/selectImportant', async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if(!user) return res.status(400).send('Invalid user id');

  const important = await Bookmark.find({'user._id': userId, important: true});

  res.send(select(important));
});

router.get('/selectUnfinished', async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if(!user) return res.status(400).send('Invalid user id');

  const unfinished = await Bookmark.find({'user._id': userId, unfinished: true});

  res.send(select(unfinished));
});

router.get('/allBookmarks', async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if(!user) return res.status(400).send('Invalid user id');

  const bookmarks = await Bookmark.find({'user._id': userId}).sort({'_id': -1});

  res.send(bookmarks)
})

const select = (bookmarks) => {
  const nums = [];
  const selected = [];

  const max = (bookmarks.length<3)?bookmarks.length-1 : 2

  for(let i=0; nums.length<=max; i++){
    const num = Math.floor(Math.random() * bookmarks.length);
    if(!nums.includes(num)){
      selected.push(bookmarks[num]);
      nums.push(num)
    }
  }
  return selected;
}

router.post('/search', async (req, res)=>{
  const tags = req.body.tags;

  const userId = req.user._id;
  const user = await User.findById(userId);
  if(!user) return res.status(400).send('Invalid user id');
  const bookmarks = await Bookmark.find({'user._id': userId, 'tags.text': {$all: tags}});

  res.send(bookmarks)
  // const results = tags.map( async tag => {
  //   return await Bookmark.find({'user._id': userId, 'tags.text': tag});
  // })

  // Promise.all(results).then(bookmarkObjs =>{
  //   let bookmarks = [];
  //   bookmarkObjs.map(bookmark=> {
  //     bookmarks = [...bookmarks,...bookmark]
  //   })
  //   console.log(bookmarks)


  //   res.send(bookmarks)
  // })


})

router.post('/preview', async (req, res) => {
  const targetUrl = req.body.url;
  if(targetUrl){
    const data = async () => {
      const values = await got(targetUrl).catch((e)=>console.error(e.message));
      if(values) {
        const { body: html, url } = await values;
        var metadata = await metascraper({ html, url });
        return metadata
      } else {
        return {title: 'No title'}
      }
    }
  
    data().then((meta)=>{
      res.send({body: meta})
    })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)    
  const {error} = validate(req.body);
  if(error) {
    console.log('validation erro', error.details[0].message)
    return res.status(400).send(error.details[0].message);}
  // look up user
  const userId = req.user._id;

  const user = await User.findById(userId);
  if(!user) {
    return res.status(400).send('Invalid user id')};

  const {url, title, tags, note, unfinished, important, remind} = req.body;

  const targetUrl = url;

  const data = async () => {
    const values = await got(targetUrl).catch((e)=>{
      return res.status(400).send('Invalid URL')});
      if(values.statusCode!==400){
        const { body: html, url } = await values
        const metadata = await metascraper({ html, url });
        return metadata
      } else{
        throw Error('Bad URL')
      }
  }

  data().then( async (meta)=>{
    const {description, image} = meta;
    let bookmark = new Bookmark({
      user: {
        _id: user._id,
        name: user.name,
      },
      url: url,
      title: title,
      desc: description,
      image: image,
      tags: tags,
      note: note,
      unfinished: unfinished,
      important: important,
      remind: remind
    })
  
    bookmark = await bookmark.save();

    tags.map( async tag=>{
      await Tag.findOne({text: tag.text}).then(async (result)=>{
        if(!result) {
          let newTag = new Tag({
            text: tag.text
          })
          await newTag.save()
        }
        return null
      })

      if(!user.tags.includes(tag.text)){
          user.tags.push(tag.text);
          await user.save()
      }
    })
  
    res.send(bookmark)
  }).catch(e=>console.error(e.message));
});

module.exports = router;