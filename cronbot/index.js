const axios = require('axios');
const cron = require('node-cron');
const { getDb } = require('../db/conn.js');

const UNISWAP_V3_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'

const config = {
    // Recent Pools, tokens and prices
    botPoolRecent: true,
    botPoolRecentSeek: 0,
    botPoolRecentMaxSeek: 1000,

    // Old Pools, tokens and prices
    botPoolOld: true,
    botPoolOldSeek: 0,
    botPoolOldMaxSeek: 1000,
    botPoolOldTotalSkip: 0,

    // Period
    //lastPeriod: 1708287872 // 2024-02-19
    lastTimestamp: 1713386782
}

const fetchRecentPools = async () => {

    const query = `
        {
            pools(orderBy: createdAtTimestamp, skip: ${config.botPoolRecentSeek * 100}, first: 100) {
                id
                token0 {
                    id
                    name
                    symbol
                    decimals
                    derivedETH
                }
                token1 {
                    id
                    name
                    decimals
                    symbol
                    derivedETH
                }
                createdAtTimestamp
              }
        }
    `;
    try {
        const response = await axios.post(UNISWAP_V3_SUBGRAPH_URL, { query });
        if (response && response.data && response.data.data.pools) {
            if (response.data.data.pools.length > 0) {
                return response.data.data.pools;
            }
        }

        return [];
    } catch (error) {
        console.error("Error fetching tokens from Uniswap:", error);
        return [];
    }
}

const postToDB = async () => {
    const pools = await fetchRecentPools();
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
            // console.log(result)
        }).catch(e => {
            console.log(e)
        });
    }
    config.botPoolRecentSeek = config.botPoolRecentSeek + 1;
    if (config.botPoolRecentSeek > config.botPoolRecentMaxSeek)
        config.botPoolRecentSeek = 0;
}

cron.schedule('*/10 * * * * *', async () => {
    if (config.botPoolRecent) {
        console.log('Fetching new tokens', config.botPoolRecentSeek);
        await postToDB();
    }
});
