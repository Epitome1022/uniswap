const dotenv = require('dotenv')
dotenv.config();
const { botPriceRecent } = require('./config.js');
const { formatPrices, sleep, tokensInDb, pricesCollection } = require('./common.js');
const { fetchTokenDayDatas } = require('./thirdparty.js');

connectToDatabase();

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
        while (count > seek) {
            const token = tokens[seek];
            console.log(`Token: ${token.id}`)
            let zeroLengthCount = 0;
            for (let i = 0; i < botPriceRecent.maxSeek; i++) {
                const dayDatas = await fetchTokenDayDatas(token['id'], i, lastTimestamp);
                const prices = formatPrices(dayDatas);
                const pricesToInsert = [];

                for (const price of prices) {
                    const existingPrice = await pricesCollection().findOne({ id: price.id, date: price.date });
                    if (!existingPrice) {
                        pricesToInsert.push(price);
                    }
                }

                console.log(pricesToInsert.length)
                if (pricesToInsert.length > 0) {
                    pricesCollection().insertMany(pricesToInsert).then((result) => {
                    }).catch(e => {
                        console.log(e)
                    });
                } else {
                    zeroLengthCount ++;
                }

                if (zeroLengthCount == 3)
                    break;
                await sleep(2000);
            }
            seek ++;
        }
    } catch (e) {
        console.log(e)
    }
}