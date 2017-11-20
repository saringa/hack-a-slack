'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const postSchema = new Schema({
  upvotes: [],
  downvotes: [],
  score: Number,
  owner: {
    type: ObjectId,
    ref: 'Hacker'
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  },
  time : { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post
};