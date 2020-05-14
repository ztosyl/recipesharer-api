#!/bin/bash

API="http://localhost:4741"
URL_PATH="/recipes"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer 9d9a2cc6ded0b14e72c94a5ca3e0584a" \
  --data '{
    "recipe": {
      "title": "Rice Krispies Treats",
      "meal": "Dessert",
      "difficulty": "Easy",
      "steps": ["In large saucepan melt butter over low heat. Add marshmallows and stir until completely melted. Remove from heat.", "Add cereal. Stir until well coated.", "Using buttered spatula or wax paper evenly press mixture into 13 x 9 x 2-inch pan coated with cooking spray. Cool. Cut into 2-inch squares. Best if served the same day."],
      "author": "5ebd52d34e82a845ec9787b2"
    }
  }'

echo
