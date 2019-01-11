import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import requireAuth from '../HOC/requireAuth';

import Login from './User/Login';
import App from './App';

class EntryPoint extends Component {
    componentDidMount() {
        this.props.onAutoLoginUser();
    }

    render() {
        if (this.props.username) {
            return <App />;
        } else {
            return <Login />;
        }
    }
}

const mapStateToProps = state => {
    return {
        username: state.users.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAutoLoginUser: () => dispatch(actions.autoLoginUser())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryPoint);
