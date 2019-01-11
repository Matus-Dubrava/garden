import axios from 'axios';

import {
    FETCH_RECEIPTS,
    FETCH_RECEIPT,
    REQUEST_INITIALIZED,
    REQUEST_FAILED,
    REQUEST_SUCCEEDED,
    CHANGE_SELECTED_RECEIPT,
    ADD_RECEIPT_HEADER,
    UPDATE_RECEIPT_HEADER,
    ADD_RECEIPT_ITEM,
    DELETE_RECEIPT_ITEM,
    UPDATE_STORE_ITEM_AMOUNT,
    DELETE_RECEIPT
} from './types';
import { receiptsUrl } from '../urls';

const receiptAxios = axios.create({
    baseURL: receiptsUrl,
    headers: {
        authorization: localStorage.getItem('token')
    }
});

export const fetchReceipts = () => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const res = await receiptAxios();
        dispatch({ type: FETCH_RECEIPTS, items: res.data });
        dispatch({ type: REQUEST_SUCCEEDED, message: '' });
    } catch (err) {
        dispatch({ type: REQUEST_FAILED, error: 'nepodarilo sa ziskat data' });
    }
};

export const fetchReceipt = id => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const res = await receiptAxios(`/${id}`);
        dispatch({ type: FETCH_RECEIPT, item: res.data });
        dispatch({ type: REQUEST_SUCCEEDED, message: '' });
    } catch (err) {
        dispatch({ type: REQUEST_FAILED, error: 'nepodarilo sa ziskat data' });
    }
};

export const addReceiptHeader = (
    identifier,
    company,
    date,
    price,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const receipt = { identifier, company, date, price };
        const res = await receiptAxios.post(``, receipt);
        receipt.id = res.data.insertId;

        dispatch({ type: ADD_RECEIPT_HEADER, item: receipt });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'prijemka bola uspesne vytvorena'
        });

        if (typeof cb === 'function') {
            cb(receipt.id);
        }
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa vytvorit prijemku'
        });
    }
};

export const updateReceiptHeader = (
    id,
    identifier,
    company,
    date,
    price,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const receipt = { id, identifier, company, date, price };
        await receiptAxios.post(`/update`, {
            receiptId: id,
            identifier,
            company,
            date,
            price
        });

        dispatch({ type: UPDATE_RECEIPT_HEADER, item: receipt });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'prijemka bola uspesne upravena'
        });

        if (typeof cb === 'function') {
            cb(id);
        }
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa upravit prijemku'
        });
    }
};

export const addReceiptItem = (
    receiptId,
    storeItemId,
    amount,
    name,
    code,
    inp_price,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        await receiptAxios.post(`/field`, {
            receiptId,
            storeItemId,
            amount,
            inp_price
        });

        dispatch({
            type: ADD_RECEIPT_ITEM,
            receiptId,
            storeItemId,
            amount,
            name,
            code,
            inp_price
        });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'polozka bola uspesne pridana'
        });
        dispatch({
            type: UPDATE_STORE_ITEM_AMOUNT,
            id: storeItemId,
            amount,
            increase: true
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

export const deleteReceiptItem = (
    receiptId,
    storeItemId,
    amount
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const reqestedItem = { receiptId, storeItemId };
        await receiptAxios.delete(`/field`, { data: reqestedItem });

        dispatch({ type: DELETE_RECEIPT_ITEM, ...reqestedItem });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'polozka bola uspesne odstranena'
        });
        dispatch({
            type: UPDATE_STORE_ITEM_AMOUNT,
            id: storeItemId,
            amount,
            increase: false
        });
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa odstranit polozku'
        });
    }
};

export const deleteReceipt = (id, cb) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        await receiptAxios.delete(`/`, { data: { id } });

        dispatch({ type: DELETE_RECEIPT, id });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'prijemka bola uspesne odstranena'
        });
        if (typeof cb === 'function') {
            cb();
        }
    } catch (err) {
        dispatch({
            type: REQUEST_FAILED,
            error: 'nepodarilo sa odstranit prijemku'
        });
    }
};

export const changeSelectedReceipt = id => {
    return {
        type: CHANGE_SELECTED_RECEIPT,
        id
    };
};
