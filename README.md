# Uniswap Token Info

This project is based on Express and Mongodb.

## API

> To run api server, we need to install dependencies.

npm i

or

npm install

> Run api server

npm run dev

> To get token info for recent 1 month with contract address


http://[host_address]/api/token/info?method=month&address={contract_address}

example:

http://localhost:3000/api/token/info?method=month&address=0x243cacb4d5ff6814ad668c3e225246efa886ad5a


## BOT

> To run api server, we need to install dependencies.

npm i

or

npm install

> Run the bots

node bot_pool_recent.js

node bot_price_recent.js

node bot_holder_recent.js
