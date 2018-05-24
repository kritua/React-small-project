import { handleActions } from 'redux-actions-helpers';
import { gamesToStore, errorToStore } from './actions';

const initialState = [];

export default handleActions({
    [gamesToStore]: (state, { payload }) => {
        return payload;
    },
    [errorToStore]: (state, { payload }) => {
        return payload
    }
}, { initialState });
