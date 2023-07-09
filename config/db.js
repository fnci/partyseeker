import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  /*   define: {
    timestamps: false
  }, */
  // disabale messages from seq on the terminal
  logging: false
});


export default db