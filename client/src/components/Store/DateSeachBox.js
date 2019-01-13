import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

class DateSearchBox extends Component {
    state = {
        date: ''
    };

    inputChangeHandler = event => {
        this.setState({ date: event.target.value });
    };

    submitFormHandler = event => {
        event.preventDefault();

        if (this.state.date !== this.props.selectedDate) {
            this.props.onFetchSubsetData(this.state.date);
        }
    };

    changeToCurrentDate = () => {
        if (!this.props.currentDate) {
            this.props.onChangeToCurrentDate();
        }
    };

    render() {
        return (
            <div className="date-search-box">
                <p className="date-search-box__text">
                    <span className="date-search-box__text--darker">
                        stav ku dnu:{' '}
                    </span>
                    {this.props.currentDate
                        ? 'dnesny den'
                        : this.props.selectedDate}
                </p>
                <form onSubmit={this.submitFormHandler}>
                    <input
                        className="date-search-box__input"
                        type="date"
                        name="date"
                        value={this.state.date}
                        onChange={this.inputChangeHandler}
                        required
                    />
                    <button
                        className="btn btn--outline-violet btn--small u-margin-left-xsm"
                        type="submit"
                    >
                        zmenit datum
                    </button>
                </form>
                <button
                    className={
                        this.props.currentDate
                            ? 'btn btn--small u-margin-left-xsm'
                            : 'btn btn--outline-violet btn--small u-margin-left-xsm'
                    }
                    onClick={this.changeToCurrentDate}
                >
                    sucasny stav
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentDate: state.store.currentDate,
        selectedDate: state.store.selectedDate
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeToCurrentDate: () => dispatch(actions.changeToCurrentDate()),
        onFetchSubsetData: date => dispatch(actions.fetchSubsetData(date))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DateSearchBox);
