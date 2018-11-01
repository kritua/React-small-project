import React from 'react';
import ReactDOM from 'react-dom/server';
import HtmlComponent from 'page/html';
import Application from 'page/application';
import { createStore } from 'block/core';
import PrettyError from 'pretty-error';
import getRoutes from '../app/routes';
import { ServerRouter } from 'react-router-async';
import { hookRedux } from 'hook-redux';
import { hookFetcher } from 'hook-fetcher';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import errors from 'block/errors';

const pretty = new PrettyError();
const assets = {
    javascript: {
        main: 'http://localhost:8082/main.js'
    },
    styles: {}
};

export default async function(req, res) {
    console.log('Incoming request', {
        method: req.method,
        path  : req.path
    });

    const store = createStore();

    const hooks = [
        hookFetcher({
            helpers: {
                store
            },
            server: true
        }),
        hookRedux({
            dispatch: store.dispatch
        })
    ];

    try {
        const { Router, routerProps, Component, componentProps, status, redirect } = await ServerRouter.init({
            path  : req.url,
            routes: getRoutes(store),
            hooks,
            errors
        });

        if(redirect) {
            res.redirect(status, redirect);
        } else {
            const component = (
                <Provider store={store} key="provider">
                    <Router {...routerProps}>
                        <Application>
                            <Component {...componentProps} />
                        </Application>
                    </Router>
                </Provider>
            );

            console.log('Rendering Application component into html');
            let html = ReactDOM.renderToStaticMarkup(HtmlComponent({
                state : store.getState(),
                markup: ReactDOM.renderToString(component),
                helmet: Helmet.rewind(),
                assets: assets
            }));

            console.log('Sending markup');
            res.send(`<!DOCTYPE html>${html}`);
        }
    } catch(error) {
        console.error(pretty.render(error));
        res.status(500).send('Internal error');
    }
};
