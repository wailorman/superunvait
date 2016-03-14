"use strict";

module.exports = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', '*');

    next();
};