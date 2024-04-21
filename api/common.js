const { connectToDatabase, getDb } = require('./db/conn.js');
connectToDatabase();

module.exports = {
    tokensInDb: async(date) => {
        console.log(date)
        try {
            const tokensCollection = getDb().collection("tokens");
            const uniqueTokens = await tokensCollection.aggregate([
                { $match: { existingAt: { $gte: `"${date}"` } } },
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