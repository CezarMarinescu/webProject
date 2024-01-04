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

sequelize.sync()
    .then(() => console.log('Task table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

module.exports = { Task }; 