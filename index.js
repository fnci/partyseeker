import express from "express";
import bodyParser from "body-parser";
// Main App
const app = express();



import * as dotenv from 'dotenv';
// Development Variables
dotenv.config({ path: 'variables.env' });

import router from "./routes/index.js";
import path from "path";
import expressLayouts from "express-ejs-layouts";

// dbModels & Config
import db from "./config/db.js";
import users from './models/users.js';
db.sync().then(() => console.log(" db connected ")).catch((error) => console.log(error));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use(express.static('public'));
// Enable EJS as Template Engine
app.use(expressLayouts)
app.set('view engine', 'ejs');

// View Location
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, './views'));

// Middleware (Login User, Flash Messages, Current Date)
app.use((req, res, next) => {
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});







// Routing
app.use('/', router());

// Add port
app.listen(process.env.PORT, () => {
    console.log('listening on port')
});