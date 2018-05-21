import { handleActions } from 'redux-actions-helpers';
import { roomsToStore } from './actions';

const initialState = [];

export default handleActions({
    [roomsToStore]: (state, payload) => {
        return [...payload];
    }
}, { initialState });
