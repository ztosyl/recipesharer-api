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
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// get all recipes, index
router.get('/recipes', requireToken, (req, res, next) => {
  // find all recipes
  Recipe.find()
    // return recipes mapped to an array and converted to objects
    .then(recipes => {
      return recipes.map(recipes => recipes.toObject())
    })
    // send 200 and recipes in JSON
    .then(recipes => res.status(200).json({ recipes: recipes }))
    // catch error if necessary
    .catch(next)
})

// get one specific recipe
router.get('/recipes/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Recipe.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "recipe" JSON
    .then(recipe => res.status(200).json({ recipe: recipe.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// create a new recipe
router.post('/recipes', requireToken, (req, res, next) => {
  // set owner of new recipe to be current user
  req.body.recipe.author = req.user.id
  Recipe.create(req.body.recipe)
    // respond to succesful `create` with status 201 and JSON of new recipe
    .then(recipe => {
      res.status(201).json({ recipe: recipe.toObject() })
    })
    // catch any error if necessary
    .catch(next)
})

// update an existing recipe
router.patch('/recipes/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `author` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.recipe.author
  // find recipe based on ID
  Recipe.findById(req.params.id)
    // if recipe doesn't exist, throw 404
    .then(handle404)
    .then(recipe => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      console.log(recipe)
      requireOwnership(req, recipe)

      // pass the result of Mongoose's `.update` to the next `.then`
      return recipe.updateOne(req.body.recipe)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// delete a recipe
router.delete('/recipes/:id', requireToken, (req, res, next) => {
  // find recipe by ID
  Recipe.findById(req.params.id)
    // if recipe doesn't exist, throw 404
    .then(handle404)
    .then(recipe => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, recipe)
      // delete the example ONLY IF the above didn't throw
      recipe.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// post a rating to a specific recipe
router.patch('/recipes/:id/ratings', requireToken, removeBlanks, (req, res, next) => {
  // get ID and rating from request
  const id = req.params.id
  const rating = req.body.rating
  // find recipe
  Recipe.findById(id)
    // if recipe doesn't exist, throw 404
    .then(handle404)
    .then(recipe => {
      // add rating to recipe's ratings array
      recipe.ratings.push(rating)
      // save changes, return it
      return recipe.save()
    })
    // return 204 and no JSON
    .then(recipe => res.sendStatus(204))
    // catch error if necessary
    .catch(next)
})

module.exports = router
