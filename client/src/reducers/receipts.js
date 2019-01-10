import {
    FETCH_RECEIPTS,
    FETCH_RECEIPT,
    CHANGE_SELECTED_RECEIPT,
    ADD_RECEIPT_HEADER,
    UPDATE_RECEIPT_HEADER,
    ADD_RECEIPT_ITEM,
    DELETE_RECEIPT_ITEM,
    DELETE_RECEIPT
} from '../actions/types';

const INITIAL_STATE = {
    items: [],
    selectedItem: null
};

const fetchReceipts = (state, { items }) => {
    const existingItem = state.items[0];
    let updatedItems;
    if (existingItem) {
        updatedItems = [
            ...state.items.filter(it => it.id !== existingItem.id),
            existingItem
        ];
    } else {
        updatedItems = items;
    }
    return {
        ...state,
        items: updatedItems
    };
};

const fetchReceipt = (state, { item }) => {
    const updatedItems = [...state.items];
    const updatedItemIdx = updatedItems.findIndex(it => +item.id === it.id);
    let updatedItem;
    if (updatedItemIdx > -1) {
        updatedItem = { ...updatedItems[updatedItemIdx] };
        updatedItem.storeItems = item.storeItems;
        updatedItems[updatedItemIdx] = updatedItem;
    } else {
        updatedItem = item;
        updatedItems.push(item);
    }

    return {
        ...state,
        items: updatedItems,
        selectedItem: item
    };
};

const changeSelectedReceipt = (state, { id }) => {
    const item = state.items.find(item => item.id === id);
    return {
        ...state,
        selectedItem: item
    };
};

const addReceipt = (state, { item }) => {
    const items = [...state.items, item];
    return {
        ...state,
        items
    };
};

const updateReceipt = (state, { item }) => {
    const updatedItems = [...state.items];
    const updatedItemIdx = state.items.findIndex(it => it.id === item.id);
    const updatedItem = {
        ...state.items.find(it => it.id === item.id),
        ...item
    };

    updatedItems[updatedItemIdx] = updatedItem;
    return {
        ...state,
        items: updatedItems
    };
};

const addReceiptItem = (
    state,
    { receiptId, storeItemId, name, code, amount, inp_price }
) => {
    const updatedItems = [...state.items];
    const updatedItemIdx = updatedItems.findIndex(it => it.id === receiptId);
    const updatedItem = { ...updatedItems[updatedItemIdx] };

    if (!updatedItem.storeItems) {
        updatedItem.storeItems = [];
    }
    const updatedItemStoreItems = [
        ...updatedItem.storeItems,
        { id: storeItemId, code, name, amount, inp_price }
    ];

    updatedItem.storeItems = updatedItemStoreItems;
    updatedItems[updatedItemIdx] = updatedItem;

    return {
        ...state,
        items: updatedItems,
        selectedItem: updatedItem
    };
};

const deleteReceiptItem = (state, { receiptId, storeItemId }) => {
    const updatedItems = [...state.items];
    const updatedItemIdx = updatedItems.findIndex(it => +it.id === +receiptId);
    const updatedItem = updatedItems.find(it => +it.id === +receiptId);
    const updatedItemStoreItems = updatedItem.storeItems.filter(
        it => it.id !== storeItemId
    );

    updatedItem.storeItems = updatedItemStoreItems;
    updatedItems[updatedItemIdx] = updatedItem;

    return {
        ...state,
        items: updatedItems,
        selectedItem: updatedItem
    };
};

const deleteReceipt = (state, { id }) => {
    const updatedItems = state.items.filter(it => it.id !== id);
    return {
        ...state,
        items: updatedItems
    };
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DELETE_RECEIPT:
            return deleteReceipt(state, action);
        case DELETE_RECEIPT_ITEM:
            return deleteReceiptItem(state, action);
        case ADD_RECEIPT_ITEM:
            return addReceiptItem(state, action);
        case UPDATE_RECEIPT_HEADER:
            return updateReceipt(state, action);
        case ADD_RECEIPT_HEADER:
            return addReceipt(state, action);
        case CHANGE_SELECTED_RECEIPT:
            return changeSelectedReceipt(state, action);
        case FETCH_RECEIPT:
            return fetchReceipt(state, action);
        case FETCH_RECEIPTS:
            return fetchReceipts(state, action);
        default:
            return state;
    }
};
