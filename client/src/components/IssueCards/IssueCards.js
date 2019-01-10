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
                <div key={card.id} className="product-box__row">
                    <div className="product-box__col">{card.identifier}</div>
                    <div className="product-box__col">{card.receiver}</div>
                    <div className="product-box__col">
                        {card.date.split('T')[0]}
                    </div>
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
                        <div className="product-box__col">id</div>
                        <div className="product-box__col">dodavatel</div>
                        <div className="product-box__col">datum</div>
                        <div className="product-box__col" />
                    </div>
                    {this.renderIssueCards()}
                </div>
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
