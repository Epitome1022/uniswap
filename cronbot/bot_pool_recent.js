const dotenv = require('dotenv')
dotenv.config();
const { botPoolRecent } = require('./config.js');
const { formatPools, sleep, tokensCollection } = require('./common.js');
const { fetchPools } = require('./thirdparty.js');

const lastTimestamp =  process.env.LAST_TIMESTAMP

setTimeout(async () => {
    while(true)
        await save();
}, 10000);

const save = async () => {
    try {
        let zeroLengthCount = 0;
        for(let i = 0; i < botPoolRecent.maxSeek; i++) {
            const pools = await fetchPools(i, lastTimestamp);
            const tokens = formatPools(pools);
            const tokensToInsert = [];
            for (const token of tokens) {
                const existingToken = await tokensCollection().findOne({ id: token.id, existingAt: token.existingAt });
                if (!existingToken) {
                    tokensToInsert.push(token);
                }
            }
            console.log(`Page: ${i} Count: ${tokensToInsert.length}`)
            if (tokensToInsert.length > 0) {
                tokensCollection().insertMany(tokensToInsert).then((result) => {
                }).catch(e => {
                    console.log(e)
                });
            } else {
                zeroLengthCount ++;
            }

            if (zeroLengthCount > 1)
                break;

            await sleep(2000);
        }
    } catch (e) {
        console.log(e)
    }
}