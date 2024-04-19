const express= require('express');

const auth = express.Router();

auth.get('/login', async (req, res)=> {
    res.status(200).json({
        success: true,
        message: 'Logged in successfully'
    });
});

module.exports = auth