import { combineReducers } from 'redux';
import { reducer as router } from 'hook-redux';
import { reducer as formReducer } from 'redux-form';
import homeReducer from 'pages/home/reducer';

export default combineReducers({
    router,
    form    : formReducer,
    roomList: homeReducer
});
