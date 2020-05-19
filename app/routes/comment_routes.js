// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for recipes
const Recipe = require('../models/recipe')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// index all comments from a certain recipe
router.get('/recipes/:id/comments', requireToken, (req, res, next) => {
  // get recipe ID from user params
  const id = req.params.id
  // find that recipe
  Recipe.findById(id)
    // if recipe doesn't exist throw 404
    .then(handle404)
    // get the comments from the recipe, convert them to objects and map to an array
    .then(recipe => {
      const comments = recipe.comments
      return comments.map(comment => comment.toObject())
    })
    // return a 200 and the comment data
    .then(comments => res.status(200).json({ comments: comments }))
    .catch(next)
})

// post a comment to a certain recipe
// this is a .patch because we are patching the recipe in question
router.patch('/recipes/:id/comments', requireToken, removeBlanks, (req, res, next) => {
  // get ID and comment from request
  const id = req.params.id
  const comment = req.body.comment
  // set owner of new comment to be current user
  comment.author = req.user.id
  // find recipe
  Recipe.findById(id)
    // if recipe doesn't exist, throw 404
    .then(handle404)
    // push comment to recipe's comments array, save recipe
    .then(recipe => {
      recipe.comments.push(comment)
      return recipe.save()
    })
    // send 204 for successful patch
    .then(recipe => res.sendStatus(204))
    // catch error if necessary
    .catch(next)
})

module.exports = router
