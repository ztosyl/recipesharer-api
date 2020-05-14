API="http://localhost:4741"
URL_PATH="/recipes/${ID}/ingredients"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
