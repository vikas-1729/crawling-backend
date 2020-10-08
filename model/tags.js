const mongoose = require('mongoose');

const TagsSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    lowercase: true,
  },
  releatedTags: {
    type: [String],
  },
  hitCount: {
    type: Number,
    default: 0,
  },
});

const tagModel = mongoose.model('tagModel', TagsSchema);

module.exports = tagModel;
