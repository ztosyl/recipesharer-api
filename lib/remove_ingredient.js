'use strict'

const removeIngredient = (recipe, ingredId) => {
  let index = 0
  let ingredList = recipe.ingredients
  for (let i = 0; i < recipe.ingredList.length; i++) {
    if (ingredList[i].id === ingredId) {
      index = i
      ingredId.splice(i, 1)
      return recipe.save()
    }
  }
}

module.exports = removeIngredient
