import {
    REQUEST_FAILED,
    REQUEST_INITIALIZED,
    REQUEST_SUCCEEDED,
    DISMISS_ERROR,
    DISMISS_MESSAGE,
    SET_ACTIVE_LINK,
    TOGGLE_MODAL
} from '../actions/types';

const INITIAL_STATE = {
    error: '',
    message: '',
    loading: false,
    activeLink: '',
    showModal: false
};

const requestFailed = (state, { error }) => {
    return {
        ...state,
        loading: false,
        error
    };
};

const requestInitialized = state => {
    return {
        ...state,
        loading: true,
        error: '',
        message: ''
    };
};

const requestSucceeded = (state, { message }) => {
    return {
        ...state,
        message,
        error: '',
        loading: false
    };
};

const dismissError = state => {
    return {
        ...state,
        error: ''
    };
};

const dismissMessage = state => {
    return {
        ...state,
        message: ''
    };
};

const setActiveLink = (state, { linkname }) => {
    return {
        ...state,
        activeLink: linkname
    };
};

const toggleModal = (state, { showModal }) => {
    return {
        ...state,
        showModal
    };
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TOGGLE_MODAL:
            return toggleModal(state, action);
        case SET_ACTIVE_LINK:
            return setActiveLink(state, action);
        case REQUEST_INITIALIZED:
            return requestInitialized(state, action);
        case REQUEST_FAILED:
            return requestFailed(state, action);
        case REQUEST_SUCCEEDED:
            return requestSucceeded(state, action);
        case DISMISS_ERROR:
            return dismissError(state, action);
        case DISMISS_MESSAGE:
            return dismissMessage(state, action);
        default:
            return state;
    }
};
