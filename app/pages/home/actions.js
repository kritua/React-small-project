import { createAction } from 'redux-actions-helpers';

export const roomsToStore = createAction('ROOMS_TO_STORE', (payload) => ({ payload }));
export const roomsError = createAction('ERRORS_TO_STORE', (payload) => ({ payload }));

export default {
    roomsToStore,
    roomsError
}
