import {
    HISTORY_FETCH_SUCCESS
} from './types';
import axios from 'axios';

export const historyFetch = () => {
    return (dispatch) => {
        axios.get('/history')
            .then((response) => {
                dispatch({ type: HISTORY_FETCH_SUCCESS, payload: response.data })
            })
            .catch(function (error) {
                console.log(error);
            });
    };
};

