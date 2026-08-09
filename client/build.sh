#!/usr/bin/env bash
# Main-site build: static pages must ALWAYS ship.
# Vite builds the CourseBuilder (app.html + assets/). If the Vite build
# fails, deploy pure static from client/public so the site stays up;
# only /admin/course-builder is unavailable until the builder is fixed.
set -u
npm ci || npm install
if npm run build; then
  echo "Vite build OK — full deploy (static + course-builder)"
else
  echo "!!! VITE BUILD FAILED — deploying STATIC-ONLY. Course-builder offline until fixed."
  rm -rf dist
  mkdir -p dist
  cp -r public/* dist/
fi
