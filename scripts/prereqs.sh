#!/bin/bash

cd ..

# this file will install prereqs to work with hyperledger
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 1.4.4 1.4.4 0.4.18

rm -rf fabric-samples
