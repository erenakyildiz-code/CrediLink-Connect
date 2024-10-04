# CrediLink Connect
Browser Extension for Decentralised Identity Foundation hackathon


With this browser extension you can:
- Create a wallet,
- Create DID's,
- Get VC's,
- View VC's,
- Use VC's on CrediLink website

## Usage

You can use my aca-py instance running on a server, by not changing the DB_URL parameter.

Dev mode:
```
npm run dev_bex
```
Production mode:
```
npm run build_bex
```


then load unpacked at browser extensions page of chrome(ium) or firefox browsers.

## Using with your own aca-py instance

Create 3f+1 (4/7/etc.) hyperledger indy nodes.

Start aca-py on multitenant mode, then get the ip/port info and set it on the quasar.config.js file as DB_URL.
