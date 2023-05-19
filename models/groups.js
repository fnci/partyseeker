import { DataTypes } from 'sequelize';
import db from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import Categories from './categories.js';
import Users from './users.js';

const Groups = db.define('groups', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4()
    },
    name: {
        type: DataTypes.TEXT(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'The group must have a name'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please put a description'
            }
        }
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true,
        isUrl: true
    },
    image: DataTypes.TEXT
});

Groups.belongsTo(Categories);
Groups.belongsTo(Users);


export default Groups