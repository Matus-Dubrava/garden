import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { Link } from 'react-router-dom';

class IssueCards extends Component {
    componentDidMount() {
        if (!this.props.issueCards || !this.props.issueCards.length) {
            this.props.onFetchIssueCards();
        }
        this.props.onSetActiveLink('issueCards');
    }

    renderIssueCards() {
        if (this.props.issueCards) {
            return this.props.issueCards.map(card => (
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
                                    odoberatel:
                                </p>
                                <p className="card__text card__group--right">
                                    {card.receiver}
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
                            <Link
                                className="btn u-margin-left-sm u-margin-top-xsm"
                                to={`/issue-cards/detail/${card.id}`}
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
                <ul className="main-list">{this.renderIssueCards()}</ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.app.loading,
        issueCards: state.issueCards.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchIssueCards: () => dispatch(actions.fetchIssueCards()),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IssueCards);
