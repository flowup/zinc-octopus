#!/bin/bash

apt-get update

apt-get install -y git curl software-properties-common
curl -sL https://deb.nodesource.com/setup_10.x | bash -

apt-get install -y nodejs

rm -rf zinc-octopus
git clone https://github.com/flowup/zinc-octopus.git
cd zinc-octopus/servur
npm i
npm run server
