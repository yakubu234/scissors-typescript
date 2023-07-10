'use strict';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
const session = require('express-session');
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require('http')
const bodyParser = require('body-parser');
import compression from "compression";

/** parse the dot env and get the port */
dotenv.config({ path: __dirname+'/env/.env' })
const { PORT, ALLOWED_ORIGIN, JWT_SECRETE, SESSION_SECRET, DOMAIN } = process.env;

import errorHandler from './utils/ErrorHandler';
require( './utils/database.config');

const app = express();

app.set('secretKey', JWT_SECRETE); // jwt secret token

app.use(compression());

/**parse requests of content-type - application/x-www-form-urlencoded*/
app.use(bodyParser.urlencoded({ extended: true }))

/**parse requests of content-type - application/json*/
app.use(bodyParser.json())

/** serving public file , the cookie parser and show the bot page */
app.use(express.static('views'));

var whitelist = ["http://localhost:3000", "http://localhost:2000"]
var corsOptions = {
    origin: whitelist,
    credentials: true,
};

app.use(cors(corsOptions));

//sessions is here 
app.use(helmet());

app.get('/:urlID', async (req: express.Request, res: express.Response) => {
    res.end()
});

/** Standard error handling */
app.use(errorHandler)

/** catch all routes that are not defined and send response */
app.get('*', (req:express.Request, res: express.Response) => {
    res.status(404).json({
        "status": "error",
        "message": "Not Found",
        "data": null
    });
    res.end()
});

/* Connect express app server  */
const server = http.createServer(app)

/**listen for requests */
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});