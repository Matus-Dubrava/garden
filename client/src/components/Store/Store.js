import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import DateSeatchBox from './DateSeachBox';
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
        // if the date it set to current date, then show all the store items
        // otherwise show only a returned subset (different piece of redux state - itemsSubset)
        if (this.props.currentDate) {
            if (this.props.items) {
                return this.props.items.map(item => (
                    <div key={item.id} className="product-box__row">
                        <div className="product-box__col">{item.code}</div>
                        <div className="product-box__col">{item.name}</div>
                        <div className="product-box__col">
                            {item.sellingPrice}
                        </div>
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
                                onClick={this.deleteItemHandler.bind(
                                    null,
                                    item.id
                                )}
                            >
                                odstranit
                            </button>
                        </div>
                    </div>
                ));
            } else {
                return null;
            }
        } else {
            if (this.props.itemsSubset) {
                return this.props.itemsSubset.map(item => (
                    <div key={item.id} className="product-box__row">
                        <div className="product-box__col">{item.code}</div>
                        <div className="product-box__col">{item.name}</div>
                        <div className="product-box__col">{item.available}</div>
                    </div>
                ));
            } else {
                return null;
            }
        }
    }

    renderHeader() {
        if (this.props.currentDate) {
            return (
                <div className="product-box">
                    <div className="product-box__row product-box__row--header">
                        <div className="product-box__col product-box__col--header">
                            kod
                        </div>
                        <div className="product-box__col product-box__col--header">
                            nazov
                        </div>

                        <div className="product-box__col product-box__col--header">
                            predajna cena
                        </div>

                        <div className="product-box__col product-box__col--header">
                            kusov na sklade
                        </div>
                        <div className="product-box__col product-box__col--header" />
                    </div>
                    {this.renderItems()}
                </div>
            );
        } else {
            return (
                <div className="product-box">
                    <div className="product-box__row product-box__row--header">
                        <div className="product-box__col product-box__col--header">
                            kod
                        </div>
                        <div className="product-box__col product-box__col--header">
                            nazov
                        </div>
                        <div className="product-box__col product-box__col--header">
                            kusov na sklade
                        </div>
                    </div>
                    {this.renderItems()}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="wrapper u-margin-top-lg">
                <DateSeatchBox />
                {this.renderHeader()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.app.loading,
        items: state.store.items,
        currentDate: state.store.currentDate,
        itemsSubset: state.store.itemsSubset
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
