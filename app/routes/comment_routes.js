// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Recipe = require('../models/recipe')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
// const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
router.get('/recipes/:id/comments', requireToken, (req, res, next) => {
  const id = req.params.id
  Recipe.findById(id)
    .then(handle404)
    .then(recipe => {
      const comments = recipe.comments
      return comments.map(comment => comment.toObject())
    })
    .then(comments => res.status(200).json({ comments: comments }))
    .catch(next)
})

// CREATE
router.patch('/recipes/:id/comments', requireToken, removeBlanks, (req, res, next) => {
  // set owner of new example to be current user
  const id = req.params.id
  const comment = req.body.comment
  comment.author = req.user.id
  Recipe.findById(id)
    .then(handle404)
    .then(recipe => {
      recipe.comments.push(comment)
      return recipe.save()
    })
    .then(recipe => res.sendStatus(204))
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

module.exports = router
