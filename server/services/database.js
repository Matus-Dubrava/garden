const mysql = require('promise-mysql');

const config = require('../config');

module.exports = mysql.createConnection(config.mysql);
