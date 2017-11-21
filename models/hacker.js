const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hackerSchema = new Schema({
  hackername: String,
  password: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Hacker = mongoose.model('Hacker', hackerSchema);

module.exports = {
  Hacker
};
