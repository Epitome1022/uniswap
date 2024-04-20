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
    const query =`
        {
            tokenDayDatas(
                first: 1000
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

const fetchHolders = async (token_address, page, lastTimestamp) => {
    // const endpoint = `https://api.etherscan.io/api
    //     ?module=token
    //     &action=tokenholderlist
    //     &contractaddress=${token_address}
    //     &page=${page}
    //     &offset=10
    //     &apikey=YourApiKeyToken`;
    const query = `query {
        EVM(dataset: archive, network: eth) {
            TokenHolders(
              date: "2024-03-21"
              tokenSmartContract: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
              where: {Balance: {Amount: {gt: "0"}}}
            ) {
              uniq(of: Holder_Address)
            }
        }

    }`;
    
    // const config = {
    //     method: "post",

    //     url: "https://streaming.bitquery.io/graphql",

    //     headers: {
    //         "Content-Type": "application/json",

    //         "X-API-KEY": "BQYPNAQgoBHCbp1FGfw8GdZJVYlJjwKN",
    //     },

    //     data: query,
    // };

    try {
        fetch("https://streaming.bitquery.io/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-API-KEY': "BQYPNAQgoBHCbp1FGfw8GdZJVYlJjwKN",
                'Authorization': 'Bearer ory_at_gg4YlNYMp0uoSqUnD_rM8CAxlRn-SagTf-DKYtE2DVI.rckolzEb2GLix4czM1OUlvKCR7rsYVMM7SgJqI4j1Ao'
            },
            body: JSON.stringify({query})
        })
        .then(response => {
            console.log(response);
            return response
        })
        .then(data => {console.log(data); return data;})
        .catch(e => console.log('error:   ' + e));
        // if (response && response.data && response.data.data && response.data.data.pools) {
        //     if (response.data.data.pools.length > 0) {
        //         return response.data.data.pools;
        //     }
        // }

    } catch (error) {
        console.error("Error fetching tokens from Uniswap:", error);
        return [];
    }
}

module.exports = { fetchPools, fetchTokenDayDatas, fetchHolders }