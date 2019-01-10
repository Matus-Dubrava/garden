import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { Link } from 'react-router-dom';

class Receipt extends Component {
    componentDidMount() {
        if (!this.props.receipts || !this.props.receipts.length) {
            this.props.onFetchReceipt();
        }
        this.props.onSetActiveLink('receipts');
    }

    renderReceipt() {
        if (this.props.receipts) {
            return this.props.receipts.map(card => (
                <li className="main-list__item" key={card.id}>
                    <div className="card">
                        <div className="card__header">
                            <div className="card__group">
                                <p className="card__text card__group--left">
                                    id:
                                </p>
                                <p className="card__text card__group--right">
                                    {card.identifier}
                                </p>
                            </div>
                            <div className="card__group">
                                <p className="card__text card__group--left">
                                    dodavatel:
                                </p>
                                <p className="card__text card__group--right">
                                    {card.company}
                                </p>
                            </div>
                            <div className="card__group">
                                <p className="card__text card__group--left">
                                    datum:
                                </p>
                                <p className="card__text card__group--right">
                                    {card.date.split('T')[0]}
                                </p>
                            </div>
                            <div className="card__group">
                                <p className="card__text card__group--left">
                                    cena:
                                </p>
                                <p className="card__text card__group--right">
                                    {card.price}
                                </p>
                            </div>
                            <Link
                                className="btn u-margin-left-sm u-margin-top-xsm"
                                to={`/receipts/detail/${card.id}`}
                            >
                                detail
                            </Link>
                        </div>
                    </div>
                </li>
            ));
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                <ul className="main-list">{this.renderReceipt()}</ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.app.loading,
        receipts: state.receipts.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchReceipt: () => dispatch(actions.fetchReceipts()),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Receipt);
