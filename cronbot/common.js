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
    }
}