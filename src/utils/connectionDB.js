const Sequelize = require('sequelize');

const dbConfig = require('../config/dbConfig')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'postgres'
});


module.exports = sequelize;
