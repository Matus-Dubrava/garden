import axios from 'axios';

import {
    FETCH_ISSUE_CARDS,
    FETCH_ISSUE_CARD,
    REQUEST_INITIALIZED,
    REQUEST_FAILED,
    REQUEST_SUCCEEDED,
    CHANGE_SELECTED_ISSUE_CARD,
    ADD_ISSUE_CARD_HEADER,
    UPDATE_ISSUE_CARD_HEADER,
    ADD_ISSUE_CARD_ITEM,
    DELETE_ISSUE_CARD_ITEM,
    UPDATE_STORE_ITEM_AMOUNT,
    DELETE_ISSUE_CARD
} from './types';
import { issueCardsUrl } from '../urls';

const issueCardAxios = axios.create({
    baseURL: issueCardsUrl
});

export const fetchIssueCards = () => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const res = await issueCardAxios();
        dispatch({ type: FETCH_ISSUE_CARDS, items: res.data });
        dispatch({ type: REQUEST_SUCCEEDED, message: '' });
    } catch (err) {
        dispatch({ type: REQUEST_FAILED, error: 'nepodarilo sa ziskat data' });
    }
};

export const fetchIssueCard = id => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const res = await issueCardAxios(`/${id}`);
        dispatch({ type: FETCH_ISSUE_CARD, item: res.data });
        dispatch({ type: REQUEST_SUCCEEDED, message: '' });
    } catch (err) {
        dispatch({ type: REQUEST_FAILED, error: 'nepodarilo sa ziskat data' });
    }
};

export const addIssueCardHeader = (
    identifier,
    receiver,
    date,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const issueCard = { identifier, receiver, date };
        const res = await issueCardAxios.post(``, issueCard);
        issueCard.id = res.data.insertId;

        dispatch({ type: ADD_ISSUE_CARD_HEADER, item: issueCard });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'vydajka bola uspesne vytvorena'
        });

        if (typeof cb === 'function') {
            cb(issueCard.id);
        }
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa vytvorit vydajku'
        });
    }
};

export const updateIssueCardHeader = (
    id,
    identifier,
    receiver,
    date,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const issueCard = { id, identifier, receiver, date };
        await issueCardAxios.post(`/update`, {
            issueCardId: id,
            identifier,
            receiver,
            date
        });

        dispatch({ type: UPDATE_ISSUE_CARD_HEADER, item: issueCard });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'vydajka bola uspesne upravena'
        });

        if (typeof cb === 'function') {
            cb(id);
        }
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa upravit vydajku'
        });
    }
};

export const addIssueCardItem = (
    issueCardId,
    storeItemId,
    amount,
    name,
    code,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        await issueCardAxios.post(`/field`, {
            issueCardId,
            storeItemId,
            amount
        });

        dispatch({
            type: ADD_ISSUE_CARD_ITEM,
            issueCardId,
            storeItemId,
            amount,
            name,
            code
        });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'polozka bola uspesne pridana'
        });
        dispatch({
            type: UPDATE_STORE_ITEM_AMOUNT,
            id: storeItemId,
            amount,
            increase: false
        });

        if (typeof cb === 'function') {
            cb();
        }
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa pridat polozku'
        });
    }
};

export const deleteIssueCardItem = (
    issueCardId,
    storeItemId,
    amount
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const reqestedItem = { issueCardId, storeItemId };
        await issueCardAxios.delete(`/field`, { data: reqestedItem });

        dispatch({ type: DELETE_ISSUE_CARD_ITEM, ...reqestedItem });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'polozka bola uspesne odstranena'
        });
        dispatch({
            type: UPDATE_STORE_ITEM_AMOUNT,
            id: storeItemId,
            amount,
            increase: true
        });
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa odstranit polozku'
        });
    }
};

export const deleteIssueCard = (id, cb) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        await issueCardAxios.delete(`/`, { data: { id } });

        dispatch({ type: DELETE_ISSUE_CARD, id });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'vydajka bola uspesne odstranena'
        });
        if (typeof cb === 'function') {
            cb();
        }
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa odstranit vydajku'
        });
    }
};

export const changeSelectedIssueCard = id => {
    return {
        type: CHANGE_SELECTED_ISSUE_CARD,
        id
    };
};
