import {
   QUEUE_FETCH_SUCCESS
} from './types';
import axios from 'axios';

export const queueFetch = () => {
    return (dispatch) => {
        axios.get('/queue')
            .then((response) => {
                dispatch({ type: QUEUE_FETCH_SUCCESS, payload: response.data })
            })
            .catch(function (error) {
                console.log(error);
            });
    };
};