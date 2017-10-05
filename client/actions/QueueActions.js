import {
    QUEUE_FETCH_SUCCESS
} from './types';
import axios from 'axios';
import { Alert } from 'react-native';

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

export const requestTrade = ({ id }) => {
    return (dispatch) => {
        axios.post('/device/request-trade', { id })
            .then((response) => {
                dispatch(queueFetch());
                console.log('s-a cerut trade');
            })
            .catch(function (error) {
                console.log(error);
            });
    };
};

export const reserveCoffee = ({ id }) => {
    return (dispatch) => {
        axios.post('/device/reserve', { id })
            .then((response) => {
                dispatch(queueFetch());
                console.log('s-a rezervat');
            })
            .catch(function (error) {
                Alert.alert(
                    'Reservation failed',
                    `Coffee is allready reserved`,
                    [
                        {
                            text: 'Ok', onPress: () => {
                                dispatch(queueFetch());
                            }
                        },
                        {
                            text: 'Request Trade', onPress: () => {
                                dispatch(requestTrade({ id }));
                            }
                        }
                    ],
                    { cancelable: false }
                );
                console.log(error);
            });
    };
};
