WORKPLACE="$HOME/workplace/Photos"

WORKSPACE="$WORKPLACE/PhotosApi"

(
  cd "$WORKSPACE"
  ./scripts/gen.sh
)

WORKSPACE="$WORKPLACE/PhotosApp"
SCHEMA_PATH="$WORKPLACE/PhotosApi/api/openapi.yaml"

(
  cd "$WORKSPACE"
  rm -rf openapi-client
  npx openapi -i "$SCHEMA_PATH" -o openapi-client
)
