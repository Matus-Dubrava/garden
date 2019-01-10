import { combineReducers } from 'redux';

import storeReducer from './store';
import appReducer from './app';
import receiptsReducer from './receipts';
import issueCardsReducer from './issueCards';

export default combineReducers({
    store: storeReducer,
    app: appReducer,
    receipts: receiptsReducer,
    issueCards: issueCardsReducer
});
