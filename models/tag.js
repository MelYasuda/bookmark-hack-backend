const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true 
  }
})

tagSchema.set('toJSON', { 
  virtuals: true,
  transform: (doc, ret, options) => {
  delete ret.__v;
  ret.id = ret._id.toString();
  delete ret._id;
},})

const Tag = mongoose.model('Tag', tagSchema);

exports.Tag = Tag;