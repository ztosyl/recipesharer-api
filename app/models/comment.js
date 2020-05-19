'use strict'

// require mongoose and user for the ref
const mongoose = require('mongoose')
const User = require('./user')

const commentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = commentSchema
