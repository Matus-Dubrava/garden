import React, { Component } from 'react';
import { connect } from 'react-redux';

import { parseQueryString } from '../../utilities/utils';
import * as actions from '../../actions';

class IssueCardHeaderForm extends Component {
    state = {
        id: '',
        identifier: '',
        receiver: '',
        date: '',
        error: ''
    };

    componentDidMount() {
        if (this.props.history.location.search) {
            const { id, identifier, receiver, date } = parseQueryString(
                this.props.history.location.search
            );
            if (id) {
                this.setState({
                    id: +id,
                    identifier,
                    receiver,
                    date: date.split('T')[0]
                });
            }
        }
        this.props.onSetActiveLink('issueCards_add');
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    validateForm() {
        let issueCardIdentifiers;
        if (this.state.id) {
            const otherIssueCards = this.props.issueCards.filter(
                item => item.id !== this.state.id
            );
            issueCardIdentifiers = otherIssueCards.map(item => item.identifier);
        } else {
            issueCardIdentifiers = this.props.issueCards.map(
                item => item.identifier
            );
        }

        if (issueCardIdentifiers.includes(this.state.identifier)) {
            this.setState({ error: 'duplicitne ID' });
        } else {
            this.setState({ error: '' });
        }
    }

    formSubmitHandler = event => {
        event.preventDefault();

        this.validateForm();

        if (!this.state.error) {
            if (!this.state.id) {
                this.props.onAddIssueCard(
                    this.state.identifier,
                    this.state.receiver,
                    this.state.date,
                    id => {
                        this.props.history.replace(`/issue-cards/detail/${id}`);
                    }
                );
            } else {
                this.props.onUpdateIssueCard(
                    this.state.id,
                    this.state.identifier,
                    this.state.receiver,
                    this.state.date,
                    id => {
                        this.props.history.replace(`/issue-cards/detail/${id}`);
                    }
                );
            }
        }
    };

    render() {
        return (
            <div className="wrapper wrapper--md u-margin-top-lg">
                <form className="col-form" onSubmit={this.formSubmitHandler}>
                    <div className="col-form__header">Vytvorit vydajku</div>
                    <div className="col-form__group">
                        <label className="col-form__label">id</label>
                        <input
                            className="col-form__input"
                            type="text"
                            value={this.state.identifier}
                            name="identifier"
                            required
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <label className="col-form__label">odoberatel</label>
                        <input
                            className="col-form__input"
                            type="text"
                            value={this.state.receiver}
                            name="receiver"
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <label className="col-form__label">datum</label>
                        <input
                            className="col-form__input"
                            type="date"
                            value={this.state.date}
                            name="date"
                            onChange={this.inputChangeHandler}
                            required
                        />
                    </div>
                    <div className="col-form__group">
                        {this.state.error ? (
                            <p className="col-form__group--error">
                                {this.state.error}
                            </p>
                        ) : null}
                    </div>
                    <div className="col-form__group">
                        <button className="col-form__btn--submit">
                            pokracovat
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        issueCards: state.issueCards.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddIssueCard: (identifier, receiver, date, cb) =>
            dispatch(
                actions.addIssueCardHeader(identifier, receiver, date, cb)
            ),
        onUpdateIssueCard: (id, identifier, receiver, date, cb) =>
            dispatch(
                actions.updateIssueCardHeader(
                    id,
                    identifier,
                    receiver,
                    date,
                    cb
                )
            ),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IssueCardHeaderForm);
