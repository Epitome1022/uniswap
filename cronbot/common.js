module.exports = {
    formatPools: (pools) => {
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

        return tokens;
    },
    formatPrices: (dayDatas) => {
        const prices = [];
        dayDatas.map((dayData)=> {
            prices.push({
                "priceUSD": dayData['priceUSD'],
                "date": dayData['date'],
                "token_id": dayData['token']['id'],
                "high": dayData['high'],
                "id": dayData["id"],
                "low": dayData["low"],
                "open": dayData["open"]
            })
        });

        return prices;
    }
}