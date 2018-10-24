#! /bin/sh

URL_LATEST=https://api.github.com/repos/luvies/rbpi-temp-readings/releases/latest
BASE_SERVER=server
OUTPUT=rbpi-readings-server

echo "Fetching latest release..."
LATEST=$(curl -sL $URL_LATEST)
EXTRACT_JS="const fs = require('fs'); \
    const assets = JSON.parse(fs.readFileSync(0, 'utf-8')).assets; \
    assets[0] ? console.log(assets[0].browser_download_url) : process.exitCode = 1;"
DOWNLOAD_URL=$(echo "$LATEST" | node -e "$EXTRACT_JS")

if [ $? -eq 0 ]; then
    echo "Downloading primary asset from release..."
    curl -sLo $OUTPUT.zip $DOWNLOAD_URL
    echo "Preparing to install..."
    unzip -oq $OUTPUT -d $OUTPUT
    mkdir -p $BASE_SERVER
    echo "Installing latest server..."
    cp -rf $OUTPUT/* $BASE_SERVER/
    echo "Cleaning up..."
    rm -rf $OUTPUT.zip $OUTPUT
    echo "Done!"
else
    echo "Latest release does not have any assets, unable to download latest version"
fi
