import axios from 'axios';

import {
    REQUEST_INITIALIZED,
    REQUEST_FAILED,
    LOGIN_USER,
    REQUEST_SUCCEEDED
} from './types';
import { usersUrl } from '../urls';

const usersAxios = axios.create({ baseURL: usersUrl });

export const loginUser = (username, password) => async dispatch => {
    dispatch({ type: REQUEST_INITIALIZED });

    try {
        const res = await usersAxios.post('/login', { username, password });
        const token = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

        dispatch({ type: LOGIN_USER, token, username });
        dispatch({
            type: REQUEST_SUCCEEDED,
            message: 'prihlasenie bolo uspesne'
        });
    } catch (err) {
        console.log(err);
        dispatch({ type: REQUEST_FAILED, error: 'prihlasenie zlyhalo' });
    }
};

export const autoLoginUser = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
        return {
            type: LOGIN_USER,
            token,
            username
        };
    } else {
        return {
            type: LOGIN_USER,
            token: '',
            username: ''
        };
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    return { type: LOGIN_USER, token: '', username: '' };
};
