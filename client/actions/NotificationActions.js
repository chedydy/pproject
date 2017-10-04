import {
    ACCEPT_TRADE_COFEE,
    RESERVE_COFEE
} from './types';
import axios from 'axios';

export const acceptTrade = ({ coffeeId, userId, name }) => {
    return () => {
        axios.post('/device/complete-trade', { coffeeId, userId, name  })
        .then((response) => {
            console.log('s-a completat trade');
        })
        .catch(function (error) {
            console.log(error);
        });
    };
};

export const reserve = ({ coffeeId }) => {
    return () => {
        axios.post('/device/reserve', { coffeeId  })
        .then((response) => {
            console.log('s-a rezervat cafea');
        })
        .catch(function (error) {
            console.log(error);
        });
    };
};
