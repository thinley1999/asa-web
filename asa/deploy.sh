#!/bin/bash

# Load environment variables
if [ -f./.env ]; then
    echo "Loading environment variables..."
    export $(cat .env | sed 's/#.*//g' | xargs)
else
    echo ".env file not found"
fi

echo 'Switching to the master branch...'
git checkout master

echo 'Building the app...'
npm run build

echo 'Deploying the app on the server...'
scp -r build/* user@192.168.0.144:/var/www/asa-web/
