import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';

export const Monitor = sequelize.define(
    "Monitor",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        target : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type : {
            type: DataTypes.ENUM("DNS","TCP","TLS","HTTP"),
            allowNull: false
        },
        port : {
            type: DataTypes.INTEGER,
            allowNull : true
        },
        intervalSeconds : {
            type: DataTypes.INTEGER,
            defaultValue: 60
        },
        isActive : {
            type : DataTypes.BOOLEAN,
            defaultValue : true
        },
    },
    {
        tableName : "monitors",
        timestamps: true
    }
)