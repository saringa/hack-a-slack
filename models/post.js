'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const postSchema = new Schema({
  upvotes: {
    type: [ObjectId],
    ref: 'Hacker'
  },
  downvotes: {
    type: [ObjectId],
    ref: 'Hacker'
  },
  score: Number,
  owner: {
    type: ObjectId,
    ref: 'Hacker'
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post
};