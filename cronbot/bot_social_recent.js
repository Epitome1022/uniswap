const dotenv = require('dotenv');
const { tokensInDb, socialsCollection, sleep } = require('./common.js');
const { fetchSocialForToken } = require('./thirdparty');
dotenv.config();

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

        while (count > seek) {
            const token = tokens[seek];
            const existing = await socialsCollection().findOne({ token_id: token.id });
            const socials = await fetchSocialForToken("eth", token['id']);
            const social_info = {
                token_id: token['id'],
                social: socials
            };
            if (!existing) {
                socialsCollection().insertMany([social_info]).then(async (result) => {
                }).catch(e => {
                    console.log(e)
                });
            } else {
                socialsCollection().updateOne({ token_id: token['id'] }, { $set: { social: socials } }).then(async (result) => {
                }).catch(e => {
                    console.log(e)
                });
            }

            await sleep(1000);
            seek++;
        }
    } catch (e) {
        console.log(e)
    }
}