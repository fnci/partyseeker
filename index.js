import express from "express";
import * as dotenv from 'dotenv';

dotenv.config({path: 'variables.env'});

import router from "./routes/index.js";
import path from "path";
import expressLayouts from "express-ejs-layouts";

const app = express();

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