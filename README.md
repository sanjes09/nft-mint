# SMART CONTRACT

## Dependencies

Install dependencies with `npm install`

Recommended: 
-npm version 6.14.8
-node version 14.15.1

## Basic configuration

Rename ".env.sample" to ".env" file and add the following keys for a properly deploy: ALCHEMY_KEY, MAINNET_PRIVKEY

## Compilation

Run `npm run compile`, the compilation files will update the client ui folder automatically.

## Deployment

Run `npm run deploy-Mainnet` or `npm run deploy-Rinkeby` in order to deploy it to certain network.

After deployment, you must copy the contract address to the Client UI variables.

-------------------

# CLIENT UI

## Dependencies

Install dependencies with `npm i`

## Basic configuration

Add the following variables to the ./client/src/web3/constants.js file: CURRENT_NETWORK: ("Mainnet","Rinkeby"), CONTRACT_ADDRESS, DEPLOY_BLOCK

## Compilation

Run `npm run build`, the compilation files will update to the server folder automatically.

-------------------

# SERVER

## Dependencies

Install dependencies with `npm install`

## Basic configuration

Rename ".env.sample" to ".env" file and add the services port for the server: PORT

## Start

run `npm run start`