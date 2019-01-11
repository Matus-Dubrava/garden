import { LOGIN_USER } from '../actions/types';

const INITIAL_STATE = {
    username: '',
    token: ''
};

const loginUser = (state, { token, username }) => {
    return {
        ...state,
        token,
        username
    };
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return loginUser(state, action);
        default:
            return state;
    }
};
