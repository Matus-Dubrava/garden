import {
    DISMISS_ERROR,
    DISMISS_MESSAGE,
    SET_ACTIVE_LINK,
    TOGGLE_MODAL
} from './types';

export const dismissError = () => {
    return {
        type: DISMISS_ERROR
    };
};

export const dismissMessage = () => {
    return {
        type: DISMISS_MESSAGE
    };
};

export const setActiveLink = linkname => {
    return {
        type: SET_ACTIVE_LINK,
        linkname
    };
};

export const toggleModal = showModal => {
    return {
        type: TOGGLE_MODAL,
        showModal
    };
};
