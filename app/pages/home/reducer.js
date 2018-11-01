import { handleActions } from 'redux-actions-helpers';
import { roomsToStore, roomsError } from './actions';

const initialState = {
    rooms: [],
    error: ''
};

export default handleActions({
    [roomsToStore]: (state, action) => {
        return {
            rooms: action.payload
        };
    },
    [roomsError]: (state, action) => {
        return {
            ...state,
            error: action.payload
        };
    }
}, { initialState });
