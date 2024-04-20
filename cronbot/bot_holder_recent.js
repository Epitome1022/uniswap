const cron = require('node-cron');
const { connectToDatabase, getDb } = require('./db/conn.js');
const dotenv = require('dotenv')
dotenv.config();
const { botHolderRecent } = require('./config.js');
const { formatPools } = require('./common.js');
const { fetchHolders } = require('./subgraph.js');

connectToDatabase();

const lastTimestamp =  process.env.LAST_TIMESTAMP

setTimeout(async () => {
    // while(true)
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
        const holders = fetchHolders(0xdAC17F958D2ee523a2206206994597C13D831ec7, lastTimestamp)
        // console.log(holders);
        for(let i = 0; i < botHolderRecent.maxSeek; i++) {
            // const tokensCollection = getDb().collection("tokens");
            // tokensCollection.find({}).toArray()
            //     .then(result => {
            //         console.log(result);
            //         // Handle the retrieved data here
            //     })
            //     .catch(error => {
            //         console.error(error);
            //     });
            // for(token in tokens) {
            //     const holders = fetchHolders(token.id, lastTimestamp);
                // const holdersCollection = getDb().collection("holders");
                // const holdersToInsert = holders;
                // holdersCollection.insertMany(holdersToInsert).then(result => {

                // }).catch(e => console.log(e));
            // }
            // const tokens = formatPools(pools);
            // for (const token of tokens) {
            //     const holdersCollection = getDb().collection("holders");
            //     const holdersToInsert = [];
            //     const holders = await fetchHolders(token.id, lastTimestamp);
            //     const existingHolder = await holdersCollection.findOne({ id: token.id, existingAt: token.existingAt });
            //     if (!existingToken) {
            //         holdersToInsert.push(token);
            //     }
            //     console.log(holdersToInsert.length)
            //     if (holdersToInsert.length > 0) {
            //         holdersCollection.insertMany(holdersToInsert).then((result) => {
            //         }).catch(e => {
            //             console.log(e)
            //         });
            //     } else {
            //         zeroLengthCount ++;
            //     }
    
            //     if (zeroLengthCount > 3)
            //         break;
            // }
        }
    } catch (e) {
        console.log(e)
    }
}