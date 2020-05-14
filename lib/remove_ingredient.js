'use strict'

const DocumentNotFoundError = require('./custom_errors').DocumentNotFoundError

const removeIngredient = (recipe, ingredId) => {
  let ingredList = recipe.ingredients
  for (let i = 0; i < ingredList.length; i++) {
    let currId = ingredList[i]._id
    if (currId._id == ingredId) {
      ingredList.splice(i, 1)
      return recipe.save()
    }
  }
  throw new DocumentNotFoundError()
}

module.exports = removeIngredient
