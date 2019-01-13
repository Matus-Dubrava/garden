import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import StoreItem from './StoreItem';

class StoreItems extends Component {
    // fetch store items if they are not yet available
    componentDidMount() {
        if (!this.props.items || !this.props.items.length) {
            this.props.onFetchStoreData();
        }
    }

    renderItems() {
        // if the date it set to current date, then show all the store items
        // otherwise show only a returned subset (different piece of redux state - itemsSubset)
        if (this.props.currentDate) {
            if (this.props.items) {
                return this.props.items.map(item => (
                    <StoreItem item={item} showAdvanced />
                ));
            } else {
                return null;
            }
        } else {
            if (this.props.itemsSubset) {
                return this.props.itemsSubset.map(item => (
                    <StoreItem item={item} />
                ));
            } else {
                return null;
            }
        }
    }

    render() {
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
        onDeleteStoreItem: id => dispatch(actions.deleteStoreItem(id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreItems);
