#!/bin/bash

API="http://localhost:4741"
URL_PATH="/recipes"

curl "${API}${URL_PATH}/${ID}/comments" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "comment": {
    "title": "'"${TITLE}"'",
    "body": "'"${BODY}"'"
  }
}'

echo
