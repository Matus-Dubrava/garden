import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

class Login extends Component {
    state = {
        username: '',
        password: ''
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    formSubmitHandler = event => {
        event.preventDefault();

        this.props.onLoginUser(this.state.username, this.state.password);
    };

    render() {
        return (
            <div className="wrapper wrapper--md u-margin-top-lg">
                <form className="col-form" onSubmit={this.formSubmitHandler}>
                    <div className="col-form__header">Prihlasit sa</div>
                    <div className="col-form__group">
                        <label className="col-form__label">
                            uzivatelske meno
                        </label>
                        <input
                            className="col-form__input"
                            type="text"
                            value={this.state.username}
                            name="username"
                            required
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <label className="col-form__label">heslo</label>
                        <input
                            className="col-form__input"
                            type="password"
                            value={this.state.password}
                            name="password"
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <button className="col-form__btn--submit">
                            pokracovat
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.users.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoginUser: (username, password) =>
            dispatch(actions.loginUser(username, password))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
