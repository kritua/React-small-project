import { handleActions } from 'redux-actions-helpers';
import { gamesToStore } from './actions';

const initialState = [];

export default handleActions({
    [gamesToStore]: (state, payload) => {
        return payload;
    }
}, { initialState });
