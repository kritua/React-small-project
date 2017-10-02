import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Placeholder } from 'react-router-async';
import { hookRedux } from 'hook-redux';
import { hookFetcher } from 'hook-fetcher';
import hookScroll from 'hook-scroll';
import getRoutes from './routes';
import createHistory from 'history/createBrowserHistory';
import { createStore } from 'block/core';
import Application from 'page/application';
import errors from 'block/errors';

const store = createStore(window.__data);
const history = createHistory();
const hooks = [
    hookFetcher({
        helpers: {
            store
        },
        noFirstFetch: true
    }),
    hookScroll({ history }),
    hookRedux({
        dispatch: store.dispatch
    })
];
const mountNode = document.getElementById('app');

BrowserRouter.init({
    history,
    hooks,
    errors,
    routes: getRoutes(store)
})
    .then(({ routerProps, callback }) => {
        render((
            <Provider store={store} key="provider">
                <BrowserRouter {...routerProps}>
                    <Application>
                        <Placeholder
                            render={({ Component, componentProps }) => { // eslint-disable-line react/jsx-no-bind
                                return (
                                    <Component {...componentProps} />
                                )
                            }}
                        />
                    </Application>
                </BrowserRouter>
            </Provider>
        ), mountNode, () => {
            callback();
        });
    })
    .catch(console.error);
