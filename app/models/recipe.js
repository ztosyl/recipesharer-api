const mongoose = require('mongoose')
const commentSchema = require('./comment')

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  meal: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  ingredients: [],
  steps: [],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
}, {
  timestamps: true
})

module.exports = mongoose.model('Example', recipeSchema)
