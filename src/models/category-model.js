
const { DataTypes } = require('sequelize');

const sequelize = require('../utils/connectionDB');

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true

    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "someone"
    }
}, {
    timestamps: false
});

module.exports = Category;