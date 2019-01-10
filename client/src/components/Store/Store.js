import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../../actions';

class Store extends Component {
    componentDidMount() {
        if (!this.props.items || !this.props.items.length) {
            this.props.onFetchStoreData();
        }
        this.props.onSetActiveLink('store');
    }

    deleteItemHandler = id => {
        this.props.onDeleteStoreItem(id);
    };

    renderItems() {
        if (this.props.items) {
            return this.props.items.map(item => (
                <div key={item.id} className="product-box__row">
                    <div className="product-box__col">{item.code}</div>
                    <div className="product-box__col">{item.name}</div>
                    <div className="product-box__col">{item.sellingPrice}</div>
                    <div className="product-box__col">{item.available}</div>
                    <div className="product-box__col">
                        <Link
                            className="btn btn--small"
                            to={`/store/add-item?id=${item.id}&name=${
                                item.name
                            }&code=${item.code}&selling-price=${
                                item.sellingPrice
                            }`}
                        >
                            upravit
                        </Link>
                        <button
                            className="btn btn--danger btn--small u-margin-left-xsm"
                            onClick={this.deleteItemHandler.bind(null, item.id)}
                        >
                            odstranit
                        </button>
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
                        <div className="product-box__col">kod</div>
                        <div className="product-box__col">nazov</div>
                        <div className="product-box__col">predajna cena</div>
                        <div className="product-box__col">kusov na sklade</div>
                        <div className="product-box__col" />
                    </div>
                    {this.renderItems()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.app.loading,
        items: state.store.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchStoreData: () => dispatch(actions.fetchStoreData()),
        onDeleteStoreItem: id => dispatch(actions.deleteStoreItem(id)),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Store);
