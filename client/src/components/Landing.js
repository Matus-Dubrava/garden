import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Landing extends Component {
    componentDidMount() {
        this.props.onSetActiveLink('/');
    }

    render() {
        return (
            <div className="landing">
                <div className="landing__item landing__item--1">
                    <h1 className="landing__header">SKLAD</h1>
                    <div className="landing__body">
                        <div>
                            <Link className="landing__link" to="/store">
                                skladove polozky
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="landing__link"
                                to="/store/add-item"
                            >
                                pridat polozku
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="landing__item landing__item--2">
                    <h1 className="landing__header">PRIJEMKY</h1>
                    <div className="landing__body">
                        <div>
                            <Link className="landing__link" to="/receipts">
                                zobrazit prijemky
                            </Link>
                        </div>
                        <div>
                            <Link className="landing__link" to="/receipts/add">
                                vytvorit prijemku
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="landing__item landing__item--3">
                    <h1 className="landing__header">VYDAJKY</h1>
                    <div className="landing__body">
                        <div>
                            <Link className="landing__link" to="/issue-cards">
                                zobrazit vydajky
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="landing__link"
                                to="/issue-cards/add"
                            >
                                vytvorit vydajku
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname))
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Landing);
