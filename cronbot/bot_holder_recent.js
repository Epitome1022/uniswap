const axios = require('axios');
const moment = require('moment');
const dotenv = require('dotenv')
dotenv.config();
const { fetchHolders } = require('./thirdparty.js')
const { holdersCollection, tokensInDb, sleep } = require('./common.js');

const lastTimestamp = process.env.LAST_TIMESTAMP

setTimeout(async () => {
    while (true) {
        const tokens = await tokensInDb();
        await save(tokens);
    }
}, 10000);

const save = async (tokens) => {
    try {
        const count = tokens.length;
        let seek = 0;

        const now = moment().unix();

        const oauth_resp = await axios.request({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            url: process.env.BITQUERY_V2_OAUTH,
            data: {
                grant_type: 'client_credentials',
                client_id: process.env.BIT_APP_ID,
                client_secret: process.env.BIT_APP_SECRET,
                scope: 'api'
            },
            method: 'post'
        });

        if (oauth_resp) {
            // console.log(oauth_resp)
            while (count > seek) {
                const token = tokens[seek];
                for (let i = 0; i < 30; i++) {
                    const theDay = moment().subtract(i, 'day');
                    const formattedDate = theDay.format('YYYY-MM-DD');
                    console.log(formattedDate, token['id'])
                    const holders = await fetchHolders(formattedDate, token['id'], oauth_resp['data']['access_token']);
                    const holderCount = {
                        token_id: token['id'],
                        existingAt: theDay.unix(),
                        num_holders: holders
                    };
                    const holdersToInsert = [];
                    console.log(holderCount)
                    holdersToInsert.push(holderCount);
                    holdersCollection().insertMany(holdersToInsert).then(async (result) => {
                        
                    }).catch(e => {
                        console.log(e)
                    });

                    await sleep(10000);
                }

                await sleep(10000);
                seek++;
            }
        }
    } catch (e) {
        console.log(e)
    }
}