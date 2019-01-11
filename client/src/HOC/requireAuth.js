import React, { Component } from 'react';
import { connect } from 'react-redux';

const requireAuth = ChildComponent => {
    class ComposedComponent extends Component {
        componentDidMount() {
            this.navigateAway();
        }

        componentDidUpdate() {
            this.navigateAway();
        }

        navigateAway() {
            if (!this.props.token) {
                this.props.history.replace('/');
            }
        }

        render() {
            return <ChildComponent {...this.props} />;
        }
    }

    const mapStateToProps = state => {
        return {
            token: state.users.token
        };
    };

    return connect(mapStateToProps)(ComposedComponent);
};

export default requireAuth;
