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

# User-home gradle.properties wins over the one prebuild regenerates
cat >"$OUT/gradle/gradle.properties" <<EOF
org.gradle.caching=true
org.gradle.parallel=true
EOF

# Dev builds only need the ABI of the test device (4x less native code); override with ARCHS=...
archs="armeabi-v7a,arm64-v8a,x86,x86_64"
[[ $profile == "development" ]] && archs="${ARCHS:-arm64-v8a}"

docker build -f "$ROOT/tools/eas-builder/Dockerfile" -t eas-build "$ROOT"
docker run \
  --rm \
  --name eas-build \
  -v "$ROOT:/app" \
  -v "$HOME/.expo:/root/.expo" \
  -v "$OUT/gradle:/root/.gradle" \
  -v "$OUT/cache:/eas-cache" \
  -v "$OUT:/eas-out" \
  -v "eas-build-node-modules:/app/node_modules" \
  -e TMPDIR=/eas-cache \
  -e EAS_LOCAL_BUILD_WORKINGDIR=/eas-cache/build \
  -e npm_config_store_dir=/eas-cache/pnpm-store \
  -e CCACHE_DIR=/eas-cache/ccache \
  -e CMAKE_C_COMPILER_LAUNCHER=ccache \
  -e CMAKE_CXX_COMPILER_LAUNCHER=ccache \
  -e ORG_GRADLE_PROJECT_reactNativeArchitectures="$archs" \
  -e GOOGLE_SERVICES_JSON=/app/apps/mobile/google-services.json \
  eas-build \
  apps/mobile \
  android \
  $profile \
  /eas-out/$output_name
