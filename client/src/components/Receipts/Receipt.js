import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ReceiptItemForm from './ReceiptItemForm';
import * as actions from '../../actions';

class IssueCards extends Component {
    state = {
        id: +this.props.history.location.pathname.split('/')[3],
        showForm: false
    };

    componentDidMount() {
        const selectedReceipt = this.props.receipts.find(
            item => item.id === this.state.id
        );
        if (selectedReceipt && 'storeItems' in selectedReceipt) {
            this.props.onChangeSelectedReceipt(this.state.id);
        } else {
            this.props.onFetchReceipt(this.state.id);
        }
        this.props.onSetActiveLink('receipts');
    }

    hideFormHandler = () => {
        this.setState({
            showForm: false
        });
    };

    deleteReceiptHandler = () => {
        if (
            this.props.selectedReceipt.storeItems &&
            this.props.selectedReceipt.storeItems.length
        ) {
            alert(
                'vymazat je mozne iba prijemku ktora neobsahuje ziadne polozky'
            );
        } else {
            this.props.onDeleteReceipt(this.state.id, () => {
                this.props.history.replace('/receipts');
            });
        }
    };

    renderReceiptStoreItems(storeItems) {
        if (storeItems) {
            return storeItems.map(item => (
                <div key={item.id} className="product-box__row">
                    <div className="product-box__col">{item.code}</div>
                    <div className="product-box__col">{item.name}</div>
                    <div className="product-box__col">{item.amount}</div>
                    <div className="product-box__col">{item.inp_price}</div>
                    <div className="product-box__col">
                        <button
                            className="btn btn--danger btn--small"
                            onClick={() =>
                                this.props.onDeleteReceiptItem(
                                    this.props.selectedReceipt.id,
                                    item.id,
                                    item.amount
                                )
                            }
                        >
                            odstanit
                        </button>
                    </div>
                </div>
            ));
        }
    }

    renderReceipt() {
        if (this.props.selectedReceipt) {
            return (
                <div className="card u-margin-top-lg">
                    <div className="card__header">
                        <div className="card__group u-margin-top-xsm">
                            <p className="card__text card__group--left">id: </p>
                            <p className="card__text card__group--right">
                                {this.props.selectedReceipt.identifier}
                            </p>
                        </div>
                        <div className="card__group">
                            <p className="card__text card__group--left">
                                dodavatel:
                            </p>
                            <p className="card__text card__group--right">
                                {this.props.selectedReceipt.company}
                            </p>
                        </div>
                        <div className="card__group">
                            <p className="card__text card__group--left">
                                datum:
                            </p>
                            <p className="card__text card__group--right">
                                {this.props.selectedReceipt.date.split('T')[0]}
                            </p>
                        </div>
                        <div className="card__group">
                            <p className="card__text card__group--left">
                                cena:
                            </p>
                            <p className="card__text card__group--right">
                                {this.props.selectedReceipt.price}
                            </p>
                        </div>
                        <Link
                            className="btn u-margin-left-sm u-margin-top-sm"
                            to={`/issue-cards/add?id=${
                                this.props.selectedReceipt.id
                            }&identifier=${
                                this.props.selectedReceipt.identifier
                            }&date=${this.props.selectedReceipt.date}&company=${
                                this.props.selectedReceipt.company
                            }&price=${this.props.selectedReceipt.price}`}
                        >
                            upravit hlavicku
                        </Link>

                        <button
                            className="btn btn--danger u-margin-left-xsm u-margin-top-sm"
                            onClick={this.deleteReceiptHandler}
                        >
                            odstanit prijemku
                        </button>
                    </div>

                    <div className="product-box">
                        <div className="product-box__row product-box__row--header">
                            <div className="product-box__col product-box__col--header">
                                kod
                            </div>
                            <div className="product-box__col product-box__col--header">
                                nazov
                            </div>
                            <div className="product-box__col product-box__col--header">
                                mnozstvo
                            </div>
                            <div className="product-box__col product-box__col--header">
                                nakupna cena
                            </div>
                            <div className="product-box__col product-box__col--header" />
                        </div>
                        {this.renderReceiptStoreItems(
                            this.props.selectedReceipt.storeItems
                        )}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.renderReceipt()}
                <div className="wrapper u-margin-top-md">
                    {this.state.showForm ? (
                        <ReceiptItemForm
                            receiptId={this.props.selectedReceipt.id}
                            hideFormHandler={this.hideFormHandler}
                        />
                    ) : null}
                    <button
                        className="btn btn--outline-blue u-margin-top-xsm"
                        onClick={() =>
                            this.setState(prevState => ({
                                showForm: !prevState.showForm
                            }))
                        }
                    >
                        {this.state.showForm
                            ? 'skryt formular'
                            : 'pridat polozku'}
                    </button>
                </div>
            </div>
        );
    }
}

const masStateToProps = state => {
    return {
        loading: state.app.loading,
        receipts: state.receipts.items,
        selectedReceipt: state.receipts.selectedItem
    };
};

const masDispatchToProps = dispatch => {
    return {
        onFetchReceipt: id => dispatch(actions.fetchReceipt(id)),
        onFetchReceipts: () => dispatch(actions.fetchReceipts()),
        onChangeSelectedReceipt: id =>
            dispatch(actions.changeSelectedReceipt(id)),
        onDeleteReceiptItem: (receiptId, storeItemId, amount) =>
            dispatch(actions.deleteReceiptItem(receiptId, storeItemId, amount)),
        onDeleteReceipt: (id, cb) => dispatch(actions.deleteReceipt(id, cb)),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    masStateToProps,
    masDispatchToProps
)(IssueCards);
