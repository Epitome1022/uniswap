const axios = require('axios');
const UNISWAP_V3_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
const dotenv = require('dotenv')
dotenv.config();
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
        if (response && response.data && response.data.data && response.data.data.pools) {
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

const fetchTokenDayDatas = async (token_address, page, lastTimestamp) => {
    const query = `
        {
            tokenDayDatas(
                first: 100
                skip: ${page * 100}
                where: { token: "${token_address}", date_gte: ${lastTimestamp} }
                orderBy: date
                orderDirection: desc
            ) {
                priceUSD
                date
                    token {
                    id
                    name
                    symbol
                    derivedETH
                }
                high
                id
                low
                open
            }
        }`;

    try {
        const response = await axios.post(UNISWAP_V3_SUBGRAPH_URL, { query });
        if (response && response.data && response.data.data && response.data.data.tokenDayDatas) {
            if (response.data.data.tokenDayDatas.length > 0) {
                return response.data.data.tokenDayDatas;
            }
        }

        return [];
    } catch (error) {
        console.error("Error fetching tokenDayDatas from Uniswap:", error);
        return [];
    }
}

const fetchHolders = async (formattedDate, token_address, access_token) => {

    try {
        const query = `query {
          EVM(dataset: archive, network: eth) {
            TokenHolders(
              date: "${formattedDate}"
              tokenSmartContract: "${token_address}"
              where: {Balance: {Amount: {gt: "0"}}}
            ) {
              uniq(of: Holder_Address)
            }
          }
        }`;

        const response = await axios.request({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            url: process.env.BITQUERY_V2_URL,
            data: JSON.stringify({ query }),
            method: 'post',
            maxBodyLength: Infinity,
        });
        if (response) {
            return response.data.data['EVM']['TokenHolders'][0]['uniq'];

        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error fetching tokens from Bitquery:", error);
        return 0;
    }
}


module.exports = { fetchPools, fetchTokenDayDatas, fetchHolders }