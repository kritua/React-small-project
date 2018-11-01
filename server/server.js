import express from 'express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import render from './render';

const expressApp = express();

expressApp.disable('x-powered-by');

// Express Middleware
expressApp.use(compression());
expressApp.use(cookieParser());
expressApp.use(json());
expressApp.use(render);

expressApp.listen(process.env.PORT || 8082, () => {
    console.info(`Listening on => ${process.env.PORT || 8082}`);
    if(__DEVELOPMENT__) {
        require('daemon-command-webpack-plugin/marker')()
    }
});
