import fetch from 'isomorphic-fetch';
import { RouterError } from 'react-router-async';

export default function (url, options) {
    return fetch(url, options).then((response) => {

        if(response.status >= 400) {
            throw new RouterError('Bad response from server', response.status);
        }

        return response.json();
    });
}
