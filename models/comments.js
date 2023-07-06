import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Users from './users.js';
import Party from "./party.js";

const Comments = db.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message : DataTypes.TEXT
}, {
    timestamps: false
});

Comments.belongsTo(Users);
Comments.belongsTo(Party);

export default Comments;