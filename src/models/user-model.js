
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utils/connectionDB');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role:
    {
        type: DataTypes.ENUM('admin', 'moderator', 'user'),
        defaultValue: 'user'
    },
    status: {
        type: DataTypes.ENUM('wait', 'active'),
        defaultValue: 'wait'
    }
}, {
    timestamps: false
});

module.exports = User;