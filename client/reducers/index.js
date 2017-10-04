import { combineReducers } from 'redux';
import QueueReducer from './queueReducer';
import HistoryReducer from './historyReducer';
export default combineReducers({
    queue: QueueReducer,
    history: HistoryReducer
});