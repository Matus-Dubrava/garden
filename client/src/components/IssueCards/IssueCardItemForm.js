import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import Backdrop from '../UI/Backdrop';
import Modal from '../UI/Modal';
import AddStoreItem from '../Store/AddStoreItem';

class IssueCardItemForm extends Component {
    state = {
        issueCardId: this.props.issueCardId,
        storeItemId: '',
        code: '',
        amount: 0,
        error: '',
        message: ''
    };

    // revalidate code when modal with form is closed, it might have been created
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.showModal && !nextProps.showModal) {
            const { error, message } = this.validateCode(this.state.code);
            this.setState({ error, message });
        }

        return true;
    }

    inputChangeHandler = event => {
        const { error, message } = this.validateForm(event);
        this.setState({
            [event.target.name]: event.target.value,
            error,
            message
        });
    };

    validateCode(value) {
        let error = this.state.error;
        let message = this.state.message;

        const storeItemCodes = this.props.storeItems.map(item => item.code);
        if (!storeItemCodes.includes(value) && value.length > 0) {
            error = ` ${value} => neexistujuci kod`;
            message = '';
        } else if (value.length > 0) {
            error = '';
            const storeItem = this.props.storeItems.find(
                item => item.code === value
            );
            message = ` ${storeItem.code} => ${storeItem.name}`;
        } else {
            error = '';
            message = '';
        }
        return { error, message };
    }

    validateForm(event) {
        let error = this.state.error;
        let message = this.state.message;

        if (event.target.name === 'code') {
            return this.validateCode(event.target.value);
        }
        return { error, message };
    }

    formSubmitHandler = event => {
        event.preventDefault();

        if (!this.state.error) {
            const storeItem = this.props.storeItems.find(
                item => item.code === this.state.code
            );
            this.props.onAddIssueCardItem(
                this.state.issueCardId,
                storeItem.id,
                this.state.amount,
                storeItem.name,
                this.state.code
            );
            this.props.hideFormHandler();
        }
    };

    createStoreItemHandler = event => {
        this.props.onToggleModal(true);
    };

    renderModal() {
        if (this.props.showModal) {
            return (
                <Backdrop>
                    <Modal>
                        <div className="wrapper wrapper--md">
                            <AddStoreItem
                                openedInModal
                                code={this.state.code}
                            />
                        </div>
                    </Modal>
                </Backdrop>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.renderModal()}
                <div className="row-form__wrapper">
                    <form
                        className="row-form"
                        onSubmit={this.formSubmitHandler}
                    >
                        <div className="row-form__row row-form__row--header">
                            <label className="row-form__col row-form__col--header">
                                kod
                            </label>
                            <label className="row-form__col row-form__col--header">
                                mnozstvo
                            </label>
                        </div>
                        <div className="row-form__row">
                            <input
                                className="row-form__col row-form__input"
                                type="text"
                                name="code"
                                required
                                value={this.state.code}
                                onChange={this.inputChangeHandler}
                            />
                            <input
                                className="row-form__col row-form__input"
                                type="number"
                                step={1}
                                name="amount"
                                required
                                value={this.state.amount}
                                onChange={this.inputChangeHandler}
                            />
                        </div>
                        <div className="row-form__row">
                            <button
                                className="row-form__col row-form__btn--submit"
                                type="submit"
                            >
                                potvrdit
                            </button>
                        </div>
                    </form>
                    <div className="row-form__message">
                        {this.state.error ? (
                            <div className="row-form__col row-form__col--error">
                                <p>{this.state.error}</p>
                                <button
                                    onClick={this.createStoreItemHandler}
                                    className="row-form__message-btn row-form__message-btn--error"
                                >
                                    vytvorit polozku
                                </button>
                            </div>
                        ) : null}
                        {this.state.message ? (
                            <div className="row-form__col row-form__col--success">
                                <p>{this.state.message}</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        storeItems: state.store.items,
        showModal: state.app.showModal
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddIssueCardItem: (
            issueCardId,
            storeItemId,
            amount,
            name,
            code,
            cb
        ) =>
            dispatch(
                actions.addIssueCardItem(
                    issueCardId,
                    storeItemId,
                    amount,
                    name,
                    code,
                    cb
                )
            ),
        onToggleModal: showModal => dispatch(actions.toggleModal(showModal))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IssueCardItemForm);
