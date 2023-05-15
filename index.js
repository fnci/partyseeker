import express from "express";
import bodyParser from "body-parser";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import router from "./routes/index.js";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import * as dotenv from 'dotenv';

// Main App
const app = express();

// Development Variables
dotenv.config({ path: 'variables.env' });


// dbModels & Config
import db from "./config/db.js";
/* import users from './models/users.js'; */
db.sync().then(() => console.log("DB Connected")).catch((error) => console.log(error));

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

// Enable CookieParser
app.use(cookieParser());

// Create Session
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}))

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Add flash messages
app.use(flash());

// Middleware (Login User, Flash Messages, Current Date)
app.use((req, res, next) => {
    res.locals.messages = req.flash();
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