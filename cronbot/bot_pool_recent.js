
const cron = require('node-cron');
const { connectToDatabase, getDb } = require('./db/conn.js');
const dotenv = require('dotenv')
dotenv.config();
const { botPoolRecent } = require('./config.js');
const { formatPools } = require('./common.js');
const { fetchPools } = require('./subgraph.js');

connectToDatabase();

const lastTimestamp =  process.env.LAST_TIMESTAMP

setTimeout(async () => {
    while(true)
        await save();
}, 10000);

// cron.schedule('*/10 * * * * *', async () => {
//     if (botPoolRecent.running) {
//         console.log('Fetching new tokens', botPoolRecent.seek);
//         await save();
//     }
// });

const save = async () => {
    try {
        let zeroLengthCount = 0;
        for(let i = 0; i < botPoolRecent.maxSeek; i++) {
            const pools = await fetchPools(i, lastTimestamp);
            const tokens = formatPools(pools);
            const tokensCollection = getDb().collection("tokens");
            const tokensToInsert = [];
            for (const token of tokens) {
                const existingToken = await tokensCollection.findOne({ id: token.id, existingAt: token.existingAt });
                if (!existingToken) {
                    tokensToInsert.push(token);
                }
            }
            console.log(tokensToInsert.length)
            if (tokensToInsert.length > 0) {
                tokensCollection.insertMany(tokensToInsert).then((result) => {
                }).catch(e => {
                    console.log(e)
                });
            } else {
                zeroLengthCount ++;
            }

            if (zeroLengthCount > 3)
                break;
        }
    } catch (e) {
        console.log(e)
    }
}