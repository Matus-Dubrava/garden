import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import IssueCardItemForm from './IssueCardItemForm';
import * as actions from '../../actions';

class IssueCards extends Component {
    state = {
        id: +this.props.history.location.pathname.split('/')[3],
        showForm: false
    };

    componentDidMount() {
        const selectedIssueCard = this.props.issueCards.find(
            item => item.id === this.state.id
        );
        console.log(selectedIssueCard);
        if (selectedIssueCard && 'storeItems' in selectedIssueCard) {
            this.props.onChangeSelectedIssueCard(this.state.id);
        } else {
            this.props.onFetchIssueCard(this.state.id);
        }
        this.props.onSetActiveLink('issueCards');
    }

    hideFormHandler = () => {
        this.setState({
            showForm: false
        });
    };

    deleteIssueCardHandler = () => {
        if (
            this.props.selectedIssueCard.storeItems &&
            this.props.selectedIssueCard.storeItems.length
        ) {
            alert(
                'vymazat je mozne iba vydjaku ktora neobsahuje ziadne polozky'
            );
        } else {
            this.props.onDeleteIssueCard(this.state.id, () => {
                this.props.history.replace('/issue-cards');
            });
        }
    };

    renderIssueCardStoreItems(storeItems) {
        if (storeItems) {
            return storeItems.map(item => (
                <div key={item.id} className="product-box__row">
                    <div className="product-box__col">{item.code}</div>
                    <div className="product-box__col">{item.name}</div>
                    <div className="product-box__col">{item.amount}</div>
                    <div className="product-box__col">
                        <button
                            className="btn btn--danger btn--small"
                            onClick={() =>
                                this.props.onDeleteIssueCardItem(
                                    this.props.selectedIssueCard.id,
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

    renderIssueCard() {
        if (this.props.selectedIssueCard) {
            return (
                <div className="card u-margin-top-lg">
                    <div className="card__header">
                        <div className="card__group u-margin-top-xsm">
                            <p className="card__text card__group--left">id: </p>
                            <p className="card__text card__group--right">
                                {this.props.selectedIssueCard.identifier}
                            </p>
                        </div>
                        <div className="card__group">
                            <p className="card__text card__group--left">
                                odoberatel:
                            </p>
                            <p className="card__text card__group--right">
                                {this.props.selectedIssueCard.receiver}
                            </p>
                        </div>
                        <div className="card__group">
                            <p className="card__text card__group--left">
                                datum:
                            </p>
                            <p className="card__text card__group--right">
                                {
                                    this.props.selectedIssueCard.date.split(
                                        'T'
                                    )[0]
                                }
                            </p>
                        </div>
                        <Link
                            className="btn u-margin-left-sm u-margin-top-sm"
                            to={`/issue-cards/add?id=${
                                this.props.selectedIssueCard.id
                            }&identifier=${
                                this.props.selectedIssueCard.identifier
                            }&date=${
                                this.props.selectedIssueCard.date
                            }&receiver=${
                                this.props.selectedIssueCard.receiver
                            }`}
                        >
                            upravit hlavicku
                        </Link>

                        <button
                            className="btn btn--danger u-margin-left-xsm u-margin-top-sm"
                            onClick={this.deleteIssueCardHandler}
                        >
                            odstanit vydajku
                        </button>
                    </div>

                    <div className="product-box">
                        <div className="product-box__row product-box__row--header">
                            <div className="product-box__col">kod</div>
                            <div className="product-box__col">nazov</div>
                            <div className="product-box__col">mnozstvo</div>
                            <div className="product-box__col" />
                        </div>
                        {this.renderIssueCardStoreItems(
                            this.props.selectedIssueCard.storeItems
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
                {this.renderIssueCard()}
                <div className="wrapper u-margin-top-md">
                    {this.state.showForm ? (
                        <IssueCardItemForm
                            issueCardId={this.props.selectedIssueCard.id}
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
        issueCards: state.issueCards.items,
        selectedIssueCard: state.issueCards.selectedItem
    };
};

const masDispatchToProps = dispatch => {
    return {
        onFetchIssueCard: id => dispatch(actions.fetchIssueCard(id)),
        onFetchIssueCards: () => dispatch(actions.fetchIssueCards()),
        onChangeSelectedIssueCard: id =>
            dispatch(actions.changeSelectedIssueCard(id)),
        onDeleteIssueCardItem: (issueCardId, storeItemId, amount) =>
            dispatch(
                actions.deleteIssueCardItem(issueCardId, storeItemId, amount)
            ),
        onDeleteIssueCard: (id, cb) =>
            dispatch(actions.deleteIssueCard(id, cb)),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    masStateToProps,
    masDispatchToProps
)(IssueCards);
