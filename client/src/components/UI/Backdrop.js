import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

const Modal = props => {
    const clickHandler = event => {
        // props.onToggleModal(false);
    };

    return (
        <div onClick={clickHandler} className="backdrop">
            {props.children}
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
