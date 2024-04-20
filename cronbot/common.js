const { connectToDatabase, getDb } = require('./db/conn.js');
connectToDatabase();

module.exports = {
    formatPools: (pools) => {
        const tokens = [];
        pools.map((pool) => {
            const token0 = {
                ...pool['token0'],
                pool_id: pool['id'],
                existingAt: pool['createdAtTimestamp']
            };
            const token1 = {
                ...pool['token1'],
                pool_id: pool['id'],
                existingAt: pool['createdAtTimestamp']
            };
            tokens.push(token0);
            tokens.push(token1);
        });

        return tokens;
    },
    formatPrices: (dayDatas) => {
        const prices = [];
        dayDatas.map((dayData)=> {
            prices.push({
                "priceUSD": dayData['priceUSD'],
                "date": dayData['date'],
                "token_id": dayData['token']['id'],
                "high": dayData['high'],
                "id": dayData["id"],
                "low": dayData["low"],
                "open": dayData["open"]
            })
        });

        return prices;
    },
    tokensInDb: async() => {
        try {
            const tokensCollection = getDb().collection("tokens");
            const uniqueTokens = await tokensCollection.aggregate([
                { $group: { _id: "$id", token: { $first: "$$ROOT" } } },
                { $replaceRoot: { newRoot: "$token" } },
                { $sort: { existingAt: -1 } }
            ]).toArray();
            return uniqueTokens;
        } catch(e) {
            console.log(e);
            return [];
        }
    },
    sleep: (ms) => {
        return new Promise(resolve=> setTimeout(resolve, ms));
    },
    tokensCollection: ()=> {
        return getDb().collection("tokens")
    },
    pricesCollection: ()=> {
        return getDb().collection("prices")
    },
    holdersCollection: ()=> {
        return getDb().collection("holders")
    }
}