#!/bin/bash

API="http://localhost:4741"
URL_PATH="/recipes"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "recipe": {
      "title": "Grilled Peanut Butter and Jelly",
      "meal": "Lunch",
      "difficulty": "Easy",
      "steps": ["Heat griddle or skillet to 350 degrees F (175 degrees C).", "Spread butter on one side of each slice of bread. Spread peanut butter on unbuttered side of one slice of bread, and jelly on the other.", "Place one slice, buttered side down on the griddle. Top with other slice, so that peanut butter and jelly are in the middle.", "Cook for 4 minutes on each side, or until golden brown, and heated through."],
      "author": "'"${ID}"'"
    }
  }'

echo
