import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import UserBox from './User/UserBox';

function getClassName(currentItem, activeItem) {
    let activeLink = '';
    if (activeItem === currentItem) {
        activeLink = ' nav__link--active';
    }
    return 'nav__link' + activeLink;
}

class Navigation extends Component {
    render() {
        return (
            <nav className="nav">
                <ul className="nav__list">
                    <UserBox />
                    <li className="nav__item">
                        <Link
                            className={getClassName('/', this.props.activeLink)}
                            to="/"
                        >
                            domov
                        </Link>
                    </li>
                    <li className="nav__item nav__item--title">SKLAD</li>
                    <li className="nav__item">
                        <Link
                            className={getClassName(
                                'store',
                                this.props.activeLink
                            )}
                            to="/store"
                        >
                            zobrazit skladove polozky
                        </Link>
                    </li>
                    <li className="nav__item">
                        <Link
                            className={getClassName(
                                'store_add',
                                this.props.activeLink
                            )}
                            to="/store/add-item"
                        >
                            pridat polozku
                        </Link>
                    </li>
                    <li className="nav__item nav__item--title">PRIJEMKY</li>
                    <li className="nav__item">
                        <Link
                            className={getClassName(
                                'receipts',
                                this.props.activeLink
                            )}
                            to="/receipts"
                        >
                            zobrazit prijemky
                        </Link>
                    </li>
                    <li className="nav__item">
                        <Link
                            className={getClassName(
                                'receipts_add',
                                this.props.activeLink
                            )}
                            to="/receipts/add"
                        >
                            vytvorit prijemku
                        </Link>
                    </li>
                    <li className="nav__item nav__item--title">VYDAJKY</li>
                    <li className="nav__item">
                        <Link
                            className={getClassName(
                                'issueCards',
                                this.props.activeLink
                            )}
                            to="/issue-cards"
                        >
                            zobrazit vydajky
                        </Link>
                    </li>
                    <li className="nav__item">
                        <Link
                            className={getClassName(
                                'issueCards_add',
                                this.props.activeLink
                            )}
                            to="/issue-cards/add"
                        >
                            vytvorit vydajku
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    return {
        activeLink: state.app.activeLink
    };
};

export default connect(mapStateToProps)(Navigation);
