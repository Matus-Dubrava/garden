import {
    FETCH_STORE_DATA,
    ADD_STORE_ITEM,
    DELETE_STORE_ITEM,
    UPDATE_STORE_ITEM,
    UPDATE_STORE_ITEM_AMOUNT,
    FETCH_SUBSET_DATA,
    CHANGE_TO_CURRENT_DATE,
    SWITH_ALL_DATA_AND_SUBSET,
    FILTER_BY_AMOUNT
} from '../actions/types';

const INITIAL_STATE = {
    items: [],
    itemsSubset: [],
    currentDate: true,
    selectedDate: '',
    showAll: true
};

const switchAllDataAndSubset = (state, { showAll }) => {
    return {
        ...state,
        showAll
    };
};

const fetchSubsetData = (state, { items, date }) => {
    return {
        ...state,
        currentDate: false,
        itemsSubset: items,
        selectedDate: date
    };
};

const changeToCurrentDate = state => {
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

const filterByAmount = (state, { from, to }) => {
    return {
        ...state,
        itemsSubset: state.items.filter(
            item => item.available >= from && item.available <= to
        )
    };
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FILTER_BY_AMOUNT:
            return filterByAmount(state, action);
        case SWITH_ALL_DATA_AND_SUBSET:
            return switchAllDataAndSubset(state, action);
        case CHANGE_TO_CURRENT_DATE:
            return changeToCurrentDate(state, action);
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
