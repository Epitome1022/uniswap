const axios = require('axios');
const UNISWAP_V3_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const fetchPools = async (page, lastTimestamp) => {
    const query = `
        {
            pools(orderBy: createdAtTimestamp, skip: ${page * 100}, first: 100, orderDirection: desc, where: {createdAtTimestamp_gte: "${lastTimestamp}"}) {
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

module.exports = { fetchPools }