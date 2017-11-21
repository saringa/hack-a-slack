'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
  post: {
    type: ObjectId,
    ref: 'Post'
  },
  owner: {
    type: ObjectId,
    ref: 'Hacker'
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  Comment
};