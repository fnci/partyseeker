import { DataTypes } from 'sequelize';
import db from "../config/db.js";
import bcrypt from 'bcrypt'


const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING(60),
    image: DataTypes.STRING(60),
    email: {
        type: DataTypes.STRING(30),
        // email required
        allowNull: false,
        validate: {
            isEmail: { msg: 'Please enter a valid email address' }
        },
        unique: {
            args: true,
            msg: 'Username already in use'
        }
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password must not be empty'
            }
        }
    },
    active: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tokenPassword: DataTypes.STRING,
    expireToken: DataTypes.DATE()

}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12), null);
        }
    }
})

// Method for password authentication
Users.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default Users;