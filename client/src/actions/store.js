import axios from 'axios';

import {
    REQUEST_FAILED,
    REQUEST_INITIALIZED,
    FETCH_STORE_DATA,
    ADD_STORE_ITEM,
    DELETE_STORE_ITEM,
    UPDATE_STORE_ITEM,
    REQUEST_SUCCEEDED,
    FETCH_SUBSET_DATA,
    CHANGE_TO_CURRENT_STATE
} from './types';
import { storeBaseUrl } from '../urls';

const storeAxios = axios.create({
    baseURL: storeBaseUrl,
    headers: {
        authorization: localStorage.getItem('token')
    }
});

export const fetchSubsetData = date => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const res = await storeAxios(`?date=${date}`);
        dispatch({ type: FETCH_SUBSET_DATA, items: res.data, date });
        dispatch({ type: REQUEST_SUCCEEDED });
    } catch (error) {
        dispatch({ type: REQUEST_FAILED, error: 'nepodarilo sa ziskat data' });
    }
};

export const changeToCurrentState = () => {
    return { type: CHANGE_TO_CURRENT_STATE };
};

export const fetchStoreData = () => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const res = await storeAxios.get('');
        dispatch({ type: FETCH_STORE_DATA, items: res.data });
        dispatch({ type: REQUEST_SUCCEEDED, message: '' });
    } catch (error) {
        dispatch({ type: REQUEST_FAILED, error: 'nepodarilo sa ziskat data' });
    }
};

export const addStoreItem = (
    code,
    name,
    sellingPrice,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const item = { code, name, sellingPrice, available: 0 };
        const res = await storeAxios.post('', item);
        item.id = res.data.insertId;

        dispatch({ type: ADD_STORE_ITEM, item });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: `polozka [${item.code} - ${
                item.name
            }] bola uspesne pridana`
        });

        if (typeof cb === 'function') {
            cb();
        }
    } catch (error) {
        dispatch({ type: REQUEST_FAILED, error: 'pridanie polozky zlyhalo' });
    }
};

export const updateStoreItem = (
    id,
    code,
    name,
    sellingPrice,
    cb
) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const item = { id: +id, code, name, sellingPrice: +sellingPrice };
        await storeAxios.post('/update', item);

        dispatch({ type: UPDATE_STORE_ITEM, item });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: `polozka [${item.code} - ${
                item.name
            }] bola uspesne upravena`
        });

        if (typeof cb === 'function') {
            cb();
        }
    } catch (error) {
        dispatch({ type: REQUEST_FAILED, error: 'uprava polozky zlyhala' });
    }
};

export const deleteStoreItem = id => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        await storeAxios.delete(`/${id}`);
        dispatch({ type: DELETE_STORE_ITEM, id });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: `polozka bola uspesne odstranena`
        });
    } catch (error) {
        dispatch({
            type: REQUEST_FAILED,
            error:
                'odstanenie polozky zlyhalo, na polozku sa odkazuje iny dokument'
        });
    }
};
