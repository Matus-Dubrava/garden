import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

class UserBox extends Component {
    render() {
        return (
            <div className="user-box">
                <p className="user-box__text">
                    uzivatel: {this.props.username}{' '}
                </p>
                <button
                    onClick={this.props.onLogout}
                    className="btn btn--danger btn--xsmall u-margin-left-xsm"
                >
                    odhlasit
                </button>
            </div>
        );
    }
}

const masStateToProps = state => {
    return {
        username: state.users.username
    };
};

const mapDispatchToState = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(
    masStateToProps,
    mapDispatchToState
)(UserBox);
