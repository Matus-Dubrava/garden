import {
    FETCH_STORE_DATA,
    ADD_STORE_ITEM,
    DELETE_STORE_ITEM,
    UPDATE_STORE_ITEM,
    UPDATE_STORE_ITEM_AMOUNT,
    FETCH_SUBSET_DATA,
    CHANGE_TO_CURRENT_STATE
} from '../actions/types';

const INITIAL_STATE = {
    items: [],
    currentDate: true,
    selectedDate: '',
    itemsSubset: []
};

const fetchSubsetData = (state, { items, date }) => {
    return {
        ...state,
        currentDate: false,
        itemsSubset: items,
        selectedDate: date
    };
};

const changeToCurrentState = state => {
    return {
        ...state,
        currentDate: true,
        selectedDate: ''
    };
};

const fetchStoreData = (state, { items }) => {
    return {
        ...state,
        items
    };
};

const addStoreItem = (state, { item }) => {
    item.sold = 0;
    item.bought = 0;
    const items = [...state.items, item];
    return {
        ...state,
        items
    };
};

const updateStoreItem = (state, { item }) => {
    const items = [...state.items];
    const idx = items.findIndex(i => i.id === item.id);
    items[idx] = item;
    return {
        ...state,
        items
    };
};

const deleteStoreItem = (state, { id }) => {
    const items = state.items.filter(item => item.id !== id);
    return {
        ...state,
        items
    };
};

const updateStoreItemAmount = (state, { id, amount, increase }) => {
    const updatedItems = [...state.items];
    const updatedItemIdx = updatedItems.findIndex(it => it.id === id);
    const updatedItem = { ...updatedItems[updatedItemIdx] };

    if (increase) {
        updatedItem.available += +amount;
    } else {
        updatedItem.available -= +amount;
    }
    updatedItems[updatedItemIdx] = updatedItem;

    return {
        ...state,
        items: updatedItems
    };
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_TO_CURRENT_STATE:
            return changeToCurrentState(state, action);
        case FETCH_SUBSET_DATA:
            return fetchSubsetData(state, action);
        case UPDATE_STORE_ITEM_AMOUNT:
            return updateStoreItemAmount(state, action);
        case FETCH_STORE_DATA:
            return fetchStoreData(state, action);
        case ADD_STORE_ITEM:
            return addStoreItem(state, action);
        case UPDATE_STORE_ITEM:
            return updateStoreItem(state, action);
        case DELETE_STORE_ITEM:
            return deleteStoreItem(state, action);
        default:
            return state;
    }
};
