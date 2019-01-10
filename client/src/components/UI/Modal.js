import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

const Modal = props => {
    return (
        <div className="modal">
            <div>{props.children}</div>
            <button
                onClick={props.onToggleModal.bind(null, false)}
                className="modal__close-btn"
            >
                X
            </button>
        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleModal: showModal => dispatch(actions.toggleModal(showModal))
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Modal);
