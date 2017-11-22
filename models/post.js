'use strict';

const mongoose = require('mongoose');
const Comment = require('./comment').Comment;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MAX_AGE = 24 * 60 * 60 * 1000;

const postSchema = new Schema({
  text: String,
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
  comments: [Comment.schema]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post,
  MAX_AGE
};
