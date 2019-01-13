import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import StoreItems from './StoreItems';

class StoreSearchContainer extends Component {
    state = {
        from: -Infinity,
        to: +Infinity
    };

    componentDidMount() {
        this.props.onSetActiveLink('store_search');
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    formSubmitHandler = event => {
        event.preventDefault();

        this.props.onFilterByAmount(this.state.from, this.state.to);
    };

    renderAmountFilterBox() {
        return (
            <form
                className="search-form u-margin-bottom-sm"
                onSubmit={this.formSubmitHandler}
            >
                <div className="search-form__row">
                    <p className="search-form__heading">
                        vyhladat podla mnozstva
                    </p>
                    <label className="search-form__label">od</label>
                    <input
                        className="search-form__input"
                        type="number"
                        step={1}
                        name="from"
                        onChange={this.inputChangeHandler}
                        value={this.state.from}
                        placeholder="vsetky zaporne polozky"
                    />
                    <label className="search-form__label">do</label>
                    <input
                        className="search-form__input"
                        type="number"
                        step={1}
                        name="to"
                        onChange={this.inputChangeHandler}
                        value={this.state.to}
                        placeholder="vsetky kladne polozky"
                    />
                    <button
                        className="btn btn--small u-margin-left-sm"
                        type="submit"
                    >
                        hladat
                    </button>
                </div>
            </form>
        );
    }

    render() {
        return (
            <div className="wrapper u-margin-top-lg">
                {this.renderAmountFilterBox()}
                {this.props.showAll ? null : <StoreItems />}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        showAll: state.store.showAll
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname)),
        onFilterByAmount: (from, to) =>
            dispatch(actions.filterByAmount(from, to))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreSearchContainer);
