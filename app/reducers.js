import { combineReducers } from 'redux';
import { reducer as router } from 'hook-redux';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
    router,
    form: formReducer
});
