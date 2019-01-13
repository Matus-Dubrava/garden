import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../../actions';

const StoreItem = ({ item, showAdvanced, onDeleteStoreItem }) => {
    if (showAdvanced) {
        return (
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
                        }&code=${item.code}&selling-price=${item.sellingPrice}`}
                    >
                        upravit
                    </Link>
                    <button
                        className="btn btn--danger btn--small u-margin-left-xsm"
                        onClick={onDeleteStoreItem.bind(null, item.id)}
                    >
                        odstranit
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div key={item.id} className="product-box__row">
                <div className="product-box__col">{item.code}</div>
                <div className="product-box__col">{item.name}</div>
                <div className="product-box__col">{item.available}</div>
            </div>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDeleteStoreItem: id => dispatch(actions.deleteStoreItem(id))
    };
};

export default connect(
    null,
    mapDispatchToProps
)(StoreItem);
