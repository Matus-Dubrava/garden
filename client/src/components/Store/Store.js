import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import DateSearchBox from './DateSeachBox';
import StoreItems from './StoreItems';

class Store extends Component {
    componentDidMount() {
        this.props.onSetActiveLink('store');
        this.props.onChangeToCurrentDate();
    }

    render() {
        return (
            <div className="wrapper u-margin-top-lg">
                <DateSearchBox />
                <StoreItems />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname)),
        onChangeToCurrentDate: () => dispatch(actions.changeToCurrentDate())
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Store);
