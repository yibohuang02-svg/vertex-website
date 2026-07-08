#!/usr/bin/env bash
# Builds a static export of the site and pushes it to the production server.
set -euo pipefail

REMOTE_HOST="root@47.84.246.185"
REMOTE_WWW="/home/app/nginx/opt/www"
REMOTE_TARBALL="/home/app/vertexservice_new.tar.gz"
BUILD_PORT=39273

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

[ -d node_modules ] || npm install

BUILD_DIR="$(mktemp -d)"
TARBALL="$(mktemp -u /tmp/vertexservice-XXXXXX).tar.gz"
trap 'rm -rf "$BUILD_DIR" "$TARBALL"' EXIT

echo "==> Rendering static index.html"
PORT=$BUILD_PORT node server.js &
SERVER_PID=$!
for i in $(seq 1 20); do
  curl -sf "http://localhost:$BUILD_PORT/" -o "$BUILD_DIR/index.html" && break
  sleep 0.25
done
kill "$SERVER_PID" 2>/dev/null || true

if [ ! -s "$BUILD_DIR/index.html" ]; then
  echo "Failed to render index.html — is the local server working?" >&2
  exit 1
fi

echo "==> Assembling bundle"
cp -r public/css "$BUILD_DIR/css"
cp -r public/images "$BUILD_DIR/images"
cp -r public/js "$BUILD_DIR/js"
cp vercel.json "$BUILD_DIR/vercel.json"
# COPYFILE_DISABLE stops macOS tar from adding AppleDouble (._*) metadata files.
# Archiving explicit entries (not ".") avoids carrying mktemp's restrictive
# 700 permissions on the temp dir itself into the extracted destination.
(cd "$BUILD_DIR" && COPYFILE_DISABLE=1 tar -czf "$TARBALL" index.html css images js vercel.json)

echo "==> Uploading to $REMOTE_HOST"
scp "$TARBALL" "$REMOTE_HOST:$REMOTE_TARBALL"

echo "==> Backing up live site and extracting new bundle"
ssh "$REMOTE_HOST" "cp -r $REMOTE_WWW ${REMOTE_WWW}_backup_\$(date +%Y%m%d_%H%M%S) && tar --no-same-owner -xzf $REMOTE_TARBALL -C $REMOTE_WWW && chown -R app:app $REMOTE_WWW && chmod 755 $REMOTE_WWW"

echo "==> Verifying"
curl -sI https://vertexservice.ai | head -5

echo "Deploy complete."
