#!/bin/bash

cd ../backend/land-registry

echo Initialize Hyperledger Fabric...

./startFabric.sh

echo Initialize Hyperledger Explorer...

cd ../../blockchain-explorer

rm -r -- examples/net1/crypto/*/
cp -R ../backend/first-network/crypto-config/. examples/net1/crypto/

keystoreName=$(ls ./examples/net1/crypto/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp/keystore)
perl -i -pe "s/(?<=keystore\/).+(?=\")/${keystoreName}/g" ./examples/net1/connection-profile/first-network.json

docker-compose up -d

echo Done...
