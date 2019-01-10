import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';

import Navigation from './Navigation';
import Store from './Store/Store';
import AddStoreItem from './Store/AddStoreItem';
import Receipts from './Receipts/Receipts';
import Receipt from './Receipts/Receipt';
import ReceiptHeaderForm from './Receipts/ReceiptHeaderForm';
import IssueCards from './IssueCards/IssueCards';
import IssueCard from './IssueCards/IssueCard';
import IssueCardHeaderForm from './IssueCards/IssueCardHeaderForm';
import Landing from './Landing';
import SearchBox from './SearchBox';

class App extends Component {
    componentDidMount() {
        if (!this.props.items || !this.props.items.length) {
            this.props.onFetchStoreData();
        }
        if (!this.props.issueCards || !this.props.issueCards.length) {
            this.props.onFetchIssueCards();
        }
    }

    renderError() {
        if (this.props.error) {
            return (
                <div className="flash-message flash-message--error">
                    {this.props.error}
                    <button
                        className="flash-message__btn"
                        onClick={this.props.onDismissError}
                    >
                        X
                    </button>
                </div>
            );
        } else {
            return null;
        }
    }

    renderMessage() {
        if (this.props.message) {
            return (
                <div className="flash-message flash-message--success">
                    {this.props.message}
                    <button
                        className="flash-message__btn"
                        onClick={this.props.onDismissMessage}
                    >
                        X
                    </button>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div className="container">
                        <div className="container__left">
                            <Navigation />
                        </div>
                        <div className="container__right">
                            {this.renderError()}
                            {this.renderMessage()}

                            <Route exact path="/" component={Landing} />

                            <Route exact path="/store" component={Store} />
                            <Route
                                path="/store/add-item"
                                component={AddStoreItem}
                            />

                            <Route
                                exact
                                path="/receipts"
                                component={Receipts}
                            />
                            <Route
                                path="/receipts/add"
                                component={ReceiptHeaderForm}
                            />
                            <Route
                                path="/receipts/detail/:id"
                                component={Receipt}
                            />

                            <Route
                                exact
                                path="/issue-cards"
                                component={IssueCards}
                            />
                            <Route
                                path="/issue-cards/add"
                                component={IssueCardHeaderForm}
                            />
                            <Route
                                path="/issue-cards/detail/:id"
                                component={IssueCard}
                            />
                        </div>

                        <SearchBox />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.app.error,
        message: state.app.message,
        storeItems: state.store.items,
        issueCards: state.issueCards.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onDismissError: () => dispatch(actions.dismissError()),
        onDismissMessage: () => dispatch(actions.dismissMessage()),
        onFetchStoreData: () => dispatch(actions.fetchStoreData()),
        onFetchIssueCards: () => dispatch(actions.fetchIssueCards())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
