const mongoose = require('mongoose')
const ingredientSchema = require('./ingredients')

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
  ingredients: [ingredientSchema],
  steps: [],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Example', recipeSchema)
