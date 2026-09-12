#!/bin/bash

profiles=("development" "production")

set -e

PS3="Which build profile do you want to use? "
select profile in "${profiles[@]}"; do
  [[ -n $profile ]] && break # Re-prompts on invalid input, continues if valid
done

case $profile in
"development")
  output_name="output.apk"
  ;;
"production")
  output_name="output.aab"
  ;;
esac

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
OUT="$ROOT/.eas-build"

mkdir -p "$OUT/gradle" "$OUT/cache"

docker build -f "$ROOT/tools/eas-builder/Dockerfile" -t eas-build "$ROOT"
docker run \
  --rm \
  --name eas-build \
  -v "$ROOT:/app" \
  -v "$HOME/.expo:/root/.expo" \
  -v "$OUT/gradle:/root/.gradle" \
  -v "$OUT/cache:/eas-cache" \
  -v "$OUT:/eas-out" \
  -v "/app/node_modules" \
  -e TMPDIR=/eas-cache \
  eas-build \
  apps/mobile \
  android \
  $profile \
  /eas-out/$output_name
