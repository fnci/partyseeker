import { DataTypes } from 'sequelize';
import slug from 'slug';
import { nanoid } from 'nanoid';
import db from '../config/db.js';
import Users from './users.js';
import Groups from './groups.js';

const Party = db.define('party', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'What is the title of the party?'
            }
        }
    },
    host: DataTypes.STRING,
    guests: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'What is the party about?'
            }
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'What is the date of the party?'
            }
        }
    },
    hour: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'What time is the party at?'
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'What is the address of the party?'
            }
        }
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'In which city is the party?'
            }
        }
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'What state is the party in?'
            }
        }
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'In which country is the party?'
            }
        }
    },
    location: {
        type: DataTypes.GEOMETRY('POINT')
    },
    interested: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }

}, {
    hooks: {
        async beforeCreate(party){
            const url = slug(party.title).toLowerCase();
            party.slug = `${url}-${nanoid()}`;
        }
    }
})
Party.belongsTo(Users);
Party.belongsTo(Groups);

export default Party;