const dotenv = require('dotenv')
dotenv.config();
const { fetchHolders } = require('./thirdparty.js')
const { holdersCollection, tokensInDb, sleep } = require('./common.js');

const lastTimestamp =  process.env.LAST_TIMESTAMP

setTimeout(async () => {
    while(true) {
        const tokens = await tokensInDb();
        await save(tokens);
    }
}, 10000);

const save = async (tokens) => {
    try {
        const count = tokens.length;
        let seek = 0;
        
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day}`;
        console.log(holdersCollection)
        while (count > seek) {
            const token = tokens[seek];
            const holders = await fetchHolders(formattedDate, token['id']);
            const holderCount = {
                token_id: token['id'],
                existingAt: formattedDate,
                num_holders: holders
            };
            const holdersToInsert = [];
            console.log(holderCount)
            holdersToInsert.push(holderCount);
            holdersCollection().insertMany(holdersToInsert).then((result) => {
            }).catch(e => {
                console.log(e)
            });
            await sleep(10000);
            seek ++;
        }
        
    } catch (e) {
        console.log(e)
    }
}