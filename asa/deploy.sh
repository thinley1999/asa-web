#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Check for .env file and load environment variables if found
if [ -f ./.env ]; then
    echo "Loading environment variables..."
    export $(cat .env | sed 's/#.*//g' | xargs)
else
    echo ".env file not found"
fi

# Check if the current directory contains the package.json file
if [ ! -f package.json ]; then
    echo "package.json not found in the current directory. Please run the script from the project's root directory."
    exit 1
fi

echo 'Switching to the master branch...'
git checkout master

echo 'Building the app...'
npm run build

# Verify if the build was successful
if [ ! -d dist ]; then
    echo "Dist directory not found. Something went wrong during the build process."
    exit 1
fi

echo 'Deploying the app on the server...'
scp -r dist/* user@192.168.0.144:/var/www/asa-web/

# Check if the deployment was successful
if [ $? -eq 0 ]; then
    echo 'Deployment complete.'
else
    echo 'Deployment failed.'
fi
