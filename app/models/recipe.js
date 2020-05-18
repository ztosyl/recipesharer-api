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
  comments: [commentSchema],
  ratings: [Number]
}, {
  timestamps: true
})

recipeSchema.virtual('ratingsAvg', function () {
  const ratings = this.ratings
  let sum = 0
  for (let i = 0; i < ratings.length; i++) {
    sum = sum + ratings[i]
  }
  const avg = Math.round(sum / ratings.length)
  return avg
})

module.exports = mongoose.model('Example', recipeSchema)
