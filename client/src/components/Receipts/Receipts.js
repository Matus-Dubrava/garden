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
                <div key={card.id} className="product-box__row">
                    <div className="product-box__col">{card.identifier}</div>
                    <div className="product-box__col">{card.company}</div>
                    <div className="product-box__col">
                        {card.date.split('T')[0]}
                    </div>
                    <div className="product-box__col">{card.price}</div>
                    <div className="product-box__col">
                        <Link
                            className="btn btn--small"
                            to={`/receipts/detail/${card.id}`}
                        >
                            detail
                        </Link>
                    </div>
                </div>
            ));
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="wrapper u-margin-top-lg">
                <div className="product-box product-box--rounded-top">
                    <div className="product-box__row product-box__row--header">
                        <div className="product-box__col product-box__col--header">
                            id
                        </div>
                        <div className="product-box__col product-box__col--header">
                            dodavatel
                        </div>
                        <div className="product-box__col product-box__col--header">
                            datum
                        </div>
                        <div className="product-box__col product-box__col--header">
                            cena
                        </div>
                        <div className="product-box__col product-box__col--header" />
                    </div>
                    {this.renderReceipt()}
                </div>
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
