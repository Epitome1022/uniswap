const express = require('express');
const token = express.Router();
const { getDb } = require('../db/conn.js');
const { tokensInDb, pricesCollection, holdersCollection } = require('../common.js');

token.get('/list', async (req, res) => {
    const { method } = req.query;
    let tokens = [];
    console.log(method)
    try {
        if (method == 'month') {
            const moment = require('moment');
            const oneMonthAgo = moment().subtract(1, 'month');
            tokens = await tokensInDb(oneMonthAgo.unix());

            res.status(200).json({
                success: true,
                message: 'Tokens',
                data: tokens
            });
        } else {

        }

    } catch (e) {
        res.status(200).json({
            success: false,
            message: 'Failed to get tokens ',
            data: []
        });
    }

});

token.get('/info', async (req, res) => {
    const { method, address } = req.query;
    try {
        let prices = [], holders = 0;
        if (method == 'month') {
            const moment = require('moment');
            const oneMonthAgo = moment().subtract(1, 'month');
            // const oneMonthAgoFormatted = oneMonthAgo.format('YYYY-MM-DD');
            prices = await pricesCollection().find({ token_id: `${address}`, date: { $gte: oneMonthAgo.unix() } }).toArray();
            holders = await holdersCollection().find({ token_id: `${address}`, existingAt: { $gte: oneMonthAgo.unix() } }).sort({ existingAt: -1 }).limit(1).toArray();
        } else {

        }
        res.status(200).json({
            success: true,
            message: 'Success',
            data: {
                prices,
                holders_count:holders[0]['num_holders']
            }
        });
    } catch (e) {
        console.log(e)
        res.status(200).json({
            success: false,
            message: 'Failed to get token info ',
        });
    }
});


token.get('/index', async (req, res) => {
    try {
    } catch (error) {
        console.error("Error fetching tokens from Uniswap:", error);
    }
    res.status(200).json({
        success: true,
        message: 'token/index'
    });
})

token.get('/remove_index', async (req, res) => {
    try {
        getDb().collection('tokens').deleteMany({}).then(result => {
            console.log(result)
        })

        getDb().collection('prices').deleteMany({}).then(result => {
            console.log(result)
        })

        getDb().collection('holders').deleteMany({}).then(result => {
            console.log(result)
        })
    } catch (error) {
        console.error("Error fetching tokens from Uniswap:", error);
    }
    res.status(200).json({
        success: true,
        message: 'token/remove_index'
    });
})

module.exports = token