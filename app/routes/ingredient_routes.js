// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose models for recipe and ingredient
const Recipe = require('../models/recipe')
const Ingredient = require('../models/ingredient')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

const removeIngredient = ('../../lib/remove_ingredient')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

router.get('/recipes/:id/ingredients', requireToken, (req, res, next) => {
  const id = req.params.id
  Recipe.findById(id)
    .then(handle404)
    .then(recipe => {
      return recipe.ingredients.map(ingredient => ingredient.toObject())
    })
    .then(ingredients => res.status(200).json({ ingredient: ingredients }))
    .catch(next)
})

router.patch('/recipes/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  const id = req.params.id
  const ingredient = req.body.ingredient
  Recipe.findById(id)
    .then(handle404)
    .then(recipe => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, recipe)

      // pass the result of Mongoose's `.update` to the next `.then`
      recipe.ingredients.push(ingredient)
      return recipe.save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.patch('/recipes/:id', requireToken, removeBlanks, (req, res, next) => {
  const id = req.params.id
  const ingredId = req.body.ingredient.ingredId
  Recipe.findById(id)
    .then(recipe => {
      return removeIngredient(recipe, ingredId)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
