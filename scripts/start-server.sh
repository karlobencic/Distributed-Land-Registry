#!/bin/bash

cd ../backend/land-registry/typescript

rm -r -- wallet/*/

npm install
npm run build

node dist/enrollAdmin
node dist/registerUser

echo Starting API server...

node dist/api
