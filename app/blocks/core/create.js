import { createStore as _createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import createSagaMiddleware from 'redux-saga'
import getSagas from 'app/sagas'

const sagaMiddleware = createSagaMiddleware();

function createStore(data) {
    const middleware = [
        sagaMiddleware,
        thunk
    ];
    let createStoreWithMiddleware;

    if(__CLIENT__ && __DEVELOPMENT__) {
        const { createLogger } = require('redux-logger');
        const logger = createLogger({
            duration : true,
            collapsed: true,
            diff     : false
        });

        middleware.push(logger);
    }

    createStoreWithMiddleware = applyMiddleware(...middleware)(_createStore);
    const reducers = require('../../reducers').default;
    const store = createStoreWithMiddleware(reducers, data);

    sagaMiddleware.run(getSagas());

    if(__DEVELOPMENT__ && module.hot) {
        module.hot.accept('./../../reducers', () => {
            store.replaceReducer(require('./../../reducers').default);
        });
    }

    return store;
}

export { createStore as default };
