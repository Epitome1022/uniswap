
const cron = require('node-cron');
const { connectToDatabase, getDb } = require('./db/conn.js');
const dotenv = require('dotenv')
dotenv.config();
const { botPriceRecent } = require('./config.js');
const { formatPrices } = require('./common.js');
const { fetchTokenDayDatas } = require('./subgraph.js');

connectToDatabase();

const lastTimestamp =  process.env.LAST_TIMESTAMP

// cron.schedule('*/10 * * * * *', async () => {
//     if (botPriceRecent.running) {
//         console.log('Fetching new prices', botPriceRecent.seek);
//         await tokensInDb();
//     }
// });

setTimeout(async () => {
    while(true) {
        const tokens = await tokensInDb();
        await save(tokens);
    }
    
}, 10000);

const tokensInDb = async ()=> {
    try {
        const tokensCollection = getDb().collection("tokens");
        const uniqueTokens = await tokensCollection.aggregate([
            { $group: { _id: "$id", token: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$token" } },
            { $sort: { existingAt: -1 } }
        ]).toArray();
        // console.log(uniqueTokens)
        return uniqueTokens;
    } catch(e) {
        console.log(e);
        return [];
    }
}

// tokensInDb();

const sleep = (ms) => {
    return new Promise(resolve=> setTimeout(resolve, ms));
}

const save = async (tokens) => {
    try {
        const count = tokens.length;
        let seek = 0;
        while (count > seek) {
            const token = tokens[seek];
            console.log(`Token: ${token.id}`)
            let zeroLengthCount = 0;
            for (let i = 0; i < botPriceRecent.maxSeek; i++) {
                const dayDatas = await fetchTokenDayDatas(token['id'], i, lastTimestamp);
                const prices = formatPrices(dayDatas);
                const pricesCollection = getDb().collection("prices");
                const pricesToInsert = [];

                for (const price of prices) {
                    const existingPrice = await pricesCollection.findOne({ id: price.id, date: price.date });
                    if (!existingPrice) {
                        pricesToInsert.push(price);
                    }
                }

                console.log(pricesToInsert.length)
                if (pricesToInsert.length > 0) {
                    pricesCollection.insertMany(pricesToInsert).then((result) => {
                    }).catch(e => {
                        console.log(e)
                    });
                } else {
                    zeroLengthCount ++;
                }

                if (zeroLengthCount == 3)
                    break;
                await sleep(2000);
            }
            seek ++;
        }
    } catch (e) {
        console.log(e)
    }
}