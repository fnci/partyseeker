import { DataTypes } from 'sequelize';
import db from "../config/db.js";
import bcrypt from 'bcrypt';

const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required.'
            }
        }
    },
    image: DataTypes.STRING,
    email: {
        type: DataTypes.STRING(30),
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A password is required'
            },
            notEmpty: {
                msg: 'Password must not be empty'
            },
            len: {
                args: [8],
                msg: 'The Password must have at least 8 characters'
            }
        }
    },
    confirmPassword: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
            confirmPassword(value){
            if(value !== this.password){
                throw new Error('The Password confirmation is invalid');
            }
           }
        }
    },
    active: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tokenPassword: DataTypes.STRING,
    expireToken: DataTypes.DATE

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