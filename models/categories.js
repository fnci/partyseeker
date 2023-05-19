import { DataTypes } from 'sequelize';
import db from "../config/db.js";


const Categories = db.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.TEXT
});



export default Categories