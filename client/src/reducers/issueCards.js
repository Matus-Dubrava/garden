import {
    FETCH_ISSUE_CARDS,
    FETCH_ISSUE_CARD,
    CHANGE_SELECTED_ISSUE_CARD,
    ADD_ISSUE_CARD_HEADER,
    UPDATE_ISSUE_CARD_HEADER,
    ADD_ISSUE_CARD_ITEM,
    DELETE_ISSUE_CARD_ITEM,
    DELETE_ISSUE_CARD
} from '../actions/types';

const INITIAL_STATE = {
    items: [],
    selectedItem: null
};

const fetchIssueCards = (state, { items }) => {
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

const fetchIssueCard = (state, { item }) => {
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

const changeSelectedIssueCard = (state, { id }) => {
    const item = state.items.find(item => item.id === id);
    return {
        ...state,
        selectedItem: item
    };
};

const addIssueCard = (state, { item }) => {
    const items = [...state.items, item];
    return {
        ...state,
        items
    };
};

const updateIssueCard = (state, { item }) => {
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

const addIssueCardItem = (
    state,
    { issueCardId, storeItemId, name, code, amount }
) => {
    const updatedItems = [...state.items];
    const updatedItemIdx = updatedItems.findIndex(it => it.id === issueCardId);
    const updatedItem = { ...updatedItems[updatedItemIdx] };
    if (!updatedItem.storeItems) {
        updatedItem.storeItems = [];
    }
    const updatedItemStoreItems = [
        ...updatedItem.storeItems,
        { id: storeItemId, code, name, amount }
    ];

    updatedItem.storeItems = updatedItemStoreItems;
    updatedItems[updatedItemIdx] = updatedItem;
    return {
        ...state,
        items: updatedItems,
        selectedItem: updatedItem
    };
};

const deleteIssueCardItem = (state, { issueCardId, storeItemId }) => {
    const updatedItems = [...state.items];
    const updatedItemIdx = updatedItems.findIndex(
        it => +it.id === +issueCardId
    );
    const updatedItem = updatedItems.find(it => +it.id === +issueCardId);
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

const deleteIssueCard = (state, { id }) => {
    const updatedItems = state.items.filter(it => it.id !== id);
    return {
        ...state,
        items: updatedItems
    };
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DELETE_ISSUE_CARD:
            return deleteIssueCard(state, action);
        case DELETE_ISSUE_CARD_ITEM:
            return deleteIssueCardItem(state, action);
        case ADD_ISSUE_CARD_ITEM:
            return addIssueCardItem(state, action);
        case UPDATE_ISSUE_CARD_HEADER:
            return updateIssueCard(state, action);
        case ADD_ISSUE_CARD_HEADER:
            return addIssueCard(state, action);
        case CHANGE_SELECTED_ISSUE_CARD:
            return changeSelectedIssueCard(state, action);
        case FETCH_ISSUE_CARD:
            return fetchIssueCard(state, action);
        case FETCH_ISSUE_CARDS:
            return fetchIssueCards(state, action);
        default:
            return state;
    }
};
