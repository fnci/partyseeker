import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from "express";
import bodyParser from "body-parser";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import router from "./routes/index.js";
import path from "path";
import expressLayouts from "express-ejs-layouts";

// Main App
const app = express();

// Development Variables

// dbModels & Config
import db from "./config/db.js";
db.sync().then(() => console.log("DB Connected")).catch((error) => console.log(error));
import Users from './models/users.js';
await Users.sync();
import Categories from "./models/categories.js";
await Categories.sync();
import Groups from './models/groups.js';
await Groups.sync();
import Party from './models/party.js';
await Party.sync();
import Comments from "./models/comments.js";
await Comments.sync();

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
    secret: process.env.CK_SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));
const sessionConfig = {
    name: "Authenticookie",
    secret: process.env.CK_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // By default, the httpOnly attribute is set.
        httpOnly: true,
        // The expires option should not be set directly; instead only use the maxAge option
        //  If both expires and maxAge are set in the options, then the last one defined in the object is what is used.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // Force the session identifier cookie to be set on every response.
    }
}
app.use(session(sessionConfig));
// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Add flash messages
app.use(flash());

// Middleware (Login User, Flash Messages, Current Date)
app.use((req, res, next) => {
    res.locals.user = {...req.user} || null;
    res.locals.messages = req.flash();
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

// Routing
app.use('/', router());

// Read host
const host = process.env.HOST || '0.0.0.0';
// Add port
const port = process.env.PORT || 6000;
app.listen(port, host, () => {
    console.log('listening on port')
});
