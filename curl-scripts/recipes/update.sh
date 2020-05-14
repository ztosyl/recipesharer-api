#!/bin/bash

API="http://localhost:4741"
URL_PATH="/recipes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "recipe": {
    "title": "Rice Kwispie Treats",
    "meal": "Dessert",
    "difficulty": "Too hard",
    "steps": ["In large saucepan melt butter over low heat. Add marshmallows and stir until completely melted. Remove from heat.", "Add cereal. Stir until well coated.", "Using buttered spatula or wax paper evenly press mixture into 13 x 9 x 2-inch pan coated with cooking spray. Cool. Cut into 2-inch squares. Best if served the same day."]
  }
}'

echo
