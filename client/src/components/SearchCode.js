import React, { Component } from 'react';

import { connect } from 'react-redux';

const magicStrings = {
    NAME: 'NAME',
    CODE: 'CODE'
};

function findItemsByName(name, allItems) {
    name = name.toLowerCase();
    const result = [];

    if (name.length >= 3) {
        allItems
            .map(item => ({
                name: item.name.toLowerCase(),
                code: item.code.toUpperCase(),
                available: item.available
            }))
            .forEach(item => {
                if (item.name.includes(name)) {
                    result.push(item);
                }
            });
    }

    return result;
}

function findItemsByCode(code, allItems) {
    code = code.toUpperCase();
    const result = [];

    if (code.length >= 3) {
        allItems
            .map(item => ({
                name: item.name.toLowerCase(),
                code: item.code.toUpperCase(),
                available: item.available
            }))
            .forEach(item => {
                if (item.code.includes(code)) {
                    result.push(item);
                }
            });
    }

    return result;
}

class SearchCode extends Component {
    state = {
        opened: false,
        searchString: '',
        found: [],
        searchBy: magicStrings.NAME
    };

    findItems(value, searchBy) {
        let foundItems = [];

        if (searchBy === magicStrings.NAME) {
            foundItems = findItemsByName(value, this.props.items);
        } else if (searchBy === magicStrings.CODE) {
            foundItems = findItemsByCode(value, this.props.items);
        }

        return foundItems;
    }

    inputChangeHandler = event => {
        let foundItems = this.findItems(
            event.target.value,
            this.state.searchBy
        );

        this.setState({
            searchString: event.target.value,
            found: foundItems
        });
    };

    renderFoundItems() {
        return this.state.found.map(item => (
            <li className="search-code__item" key={item.code}>
                {item.code} - {item.name} - {item.available}
            </li>
        ));
    }

    renderFoundItemsBox() {
        if (this.state.found.length) {
            return (
                <div className="search-code__result">
                    <ul className="search-code__list">
                        {this.renderFoundItems()}
                    </ul>
                </div>
            );
        } else {
            return null;
        }
    }

    changeSearchHandler = option => {
        if (option !== this.state.searchBy) {
            let newSearchByOption;
            if (this.state.searchBy === magicStrings.CODE) {
                newSearchByOption = magicStrings.NAME;
            } else if (this.state.searchBy === magicStrings.NAME) {
                newSearchByOption = magicStrings.CODE;
            }

            let foundItems = this.findItems(
                this.state.searchString,
                newSearchByOption
            );

            this.setState({
                searchBy: option,
                found: foundItems
            });
        }
    };

    renderForm() {
        if (this.state.opened) {
            return (
                <div className="search-code__wrapper">
                    {this.renderFoundItemsBox()}
                    <div className="search-code__header">
                        <button
                            onClick={() => this.setState({ opened: false })}
                            className="search-code__close-btn"
                        >
                            X
                        </button>
                        <div className="search-code__buttons">
                            <button
                                onClick={this.changeSearchHandler.bind(
                                    null,
                                    magicStrings.NAME
                                )}
                                className={
                                    this.state.searchBy === magicStrings.NAME
                                        ? 'btn btn--small '
                                        : 'btn btn--small btn--outline-violet'
                                }
                            >
                                nazov
                            </button>
                            <button
                                onClick={this.changeSearchHandler.bind(
                                    null,
                                    magicStrings.CODE
                                )}
                                className={
                                    this.state.searchBy === magicStrings.CODE
                                        ? 'btn btn--small u-margin-left-xsm'
                                        : 'btn btn--small u-margin-left-xsm btn--outline-violet'
                                }
                            >
                                kod
                            </button>
                        </div>
                        <input
                            value={this.state.searchString}
                            onChange={this.inputChangeHandler}
                            name="searchString"
                            className="search-code__input"
                            type="text"
                            autoFocus
                        />
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    renderOpenButton() {
        if (!this.state.opened) {
            return (
                <button
                    onClick={() => this.setState({ opened: true })}
                    className="btn"
                >
                    vyhladat kod
                </button>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="search-code">
                {this.renderOpenButton()}
                {this.renderForm()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        items: state.store.items
    };
};

export default connect(mapStateToProps)(SearchCode);
