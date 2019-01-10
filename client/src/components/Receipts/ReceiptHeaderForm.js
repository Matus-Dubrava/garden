import React, { Component } from 'react';
import { connect } from 'react-redux';

import { parseQueryString } from '../../utilities/utils';
import * as actions from '../../actions';

class ReceiptHeaderForm extends Component {
    state = {
        id: '',
        identifier: '',
        company: '',
        date: '',
        price: 0,
        error: ''
    };

    componentDidMount() {
        if (this.props.history.location.search) {
            const { id, identifier, company, date, price } = parseQueryString(
                this.props.history.location.search
            );
            if (id) {
                this.setState({
                    id: +id,
                    identifier,
                    company,
                    price,
                    date: date.split('T')[0]
                });
            }
        }
        this.props.onSetActiveLink('receipts_add');
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    validateForm() {
        let receiptIdentifiers;
        if (this.state.id) {
            const otherReceipts = this.props.receipts.filter(
                item => item.id !== this.state.id
            );
            receiptIdentifiers = otherReceipts.map(item => item.identifier);
        } else {
            receiptIdentifiers = this.props.receipts.map(
                item => item.identifier
            );
        }

        if (receiptIdentifiers.includes(this.state.identifier)) {
            this.setState({ error: 'duplicitne ID' });
        } else {
            this.setState({ error: '' });
        }
    }

    formSubmitHandler = event => {
        event.preventDefault();

        this.validateForm();

        if (!this.state.error) {
            if (!this.state.id) {
                this.props.onAddReceipts(
                    this.state.identifier,
                    this.state.company,
                    this.state.date,
                    this.state.price,
                    id => {
                        this.props.history.replace(`/receipts/detail/${id}`);
                    }
                );
            } else {
                this.props.onUpdateReceipt(
                    this.state.id,
                    this.state.identifier,
                    this.state.company,
                    this.state.date,
                    this.state.price,
                    id => {
                        this.props.history.replace(`/receipts/detail/${id}`);
                    }
                );
            }
        }
    };

    render() {
        return (
            <div className="wrapper wrapper--md u-margin-top-lg">
                <form className="col-form" onSubmit={this.formSubmitHandler}>
                    <div className="col-form__header">Vytvorit prijemku</div>
                    <div className="col-form__group">
                        <label className="col-form__label">id</label>
                        <input
                            className="col-form__input"
                            type="text"
                            value={this.state.identifier}
                            name="identifier"
                            required
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <label className="col-form__label">dodavatel</label>
                        <input
                            className="col-form__input"
                            type="text"
                            value={this.state.company}
                            name="company"
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <label className="col-form__label">datum</label>
                        <input
                            className="col-form__input"
                            type="date"
                            value={this.state.date}
                            name="date"
                            onChange={this.inputChangeHandler}
                            required
                        />
                    </div>
                    <div className="col-form__group">
                        <label className="col-form__label">cena</label>
                        <input
                            className="col-form__input"
                            type="number"
                            step={0.01}
                            value={this.state.price}
                            name="price"
                            onChange={this.inputChangeHandler}
                            required
                        />
                    </div>
                    <div className="col-form__group">
                        {this.state.error ? (
                            <p className="col-form__group--error">
                                {this.state.error}
                            </p>
                        ) : null}
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
        receipts: state.receipts.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddReceipts: (identifier, receiver, date, price, cb) =>
            dispatch(
                actions.addReceiptHeader(identifier, receiver, date, price, cb)
            ),
        onUpdateReceipt: (id, identifier, receiver, date, price, cb) =>
            dispatch(
                actions.updateReceiptHeader(
                    id,
                    identifier,
                    receiver,
                    date,
                    price,
                    cb
                )
            ),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReceiptHeaderForm);
