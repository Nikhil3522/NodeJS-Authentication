const express = require('express');

const router = express.Router();
console.log("Router loaded");

router.get('/', function (req, res) {
    return res.render('login');
});

module.exports = router ;