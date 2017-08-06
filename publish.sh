#!/usr/bin/env bash
cp -R _site/* ../uysio.github.io/
cd ../uysio.github.io/
git add .
git commit -m "new rendition"
git push origin master
cd -
echo "Published."
