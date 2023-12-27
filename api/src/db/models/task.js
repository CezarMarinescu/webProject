const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js')


const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "Open",
            allowNull: false,
            unique: true
        },
        allocatedToUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        createdByUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
    }, {
        tableName: 'tasks',
        timestamps: false
    });

module.exports = { Task }; 