const express = require('express');
const auth = require('./auth.js');
const token = require('./token.js');
const router = express.Router();

router.use('/auth', auth);
router.use('/token', token);

module.exports = router;