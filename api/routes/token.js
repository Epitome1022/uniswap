const express = require('express');
const token = express.Router();
const { getDb } = require('../db/conn.js');

token.get('/list', async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Tokens'
    });
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
    } catch (error) {
        console.error("Error fetching tokens from Uniswap:", error);
    }
    res.status(200).json({
        success: true,
        message: 'token/remove_index'
    });
})

module.exports = token