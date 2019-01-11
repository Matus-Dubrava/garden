import React, { Component } from 'react';
import { connect } from 'react-redux';

import { parseQueryString } from '../../utilities/utils';
import * as actions from '../../actions';

class AddStoreItem extends Component {
    state = {
        fields: {
            id: null,
            code: '',
            name: '',
            sellingPrice: 0
        },
        update: false // if true, perform UPDATE operation, if false, perform INSERT operation
    };

    componentDidMount() {
        if (this.props.history) {
            const prefillData = parseQueryString(
                this.props.history.location.search
            );
            if (prefillData) {
                const updatedFields = { ...this.state.fields };
                updatedFields.id = prefillData.id;
                updatedFields.name = prefillData.name;
                updatedFields.code = prefillData.code;
                updatedFields.sellingPrice = prefillData['selling-price'];

                this.setState({
                    update: true,
                    fields: updatedFields
                });
            }
        }

        // component was opened on modal window
        if (this.props.openedInModal) {
            const updatedFields = { ...this.state.fields };
            updatedFields.code = this.props.code;
            this.setState({
                fields: updatedFields
            });
        }
        this.props.onSetActiveLink('store_add');
    }

    inputChangeHandler = event => {
        const fieldName = event.target.name;
        const updatedFields = { ...this.state.fields };
        updatedFields[fieldName] = event.target.value;

        this.setState({ fields: updatedFields });
    };

    formSubmitHandler = event => {
        event.preventDefault();

        if (this.props.openedInModal) {
            this.props.onAddStoreItem(
                this.state.fields.code,
                this.state.fields.name,
                this.state.fields.sellingPrice,
                () => {
                    this.props.onToggleModal(false);
                }
            );
        } else if (!this.state.update) {
            this.props.onAddStoreItem(
                this.state.fields.code,
                this.state.fields.name,
                this.state.fields.sellingPrice,
                () => {
                    this.props.history.replace('/store');
                }
            );
        } else {
            this.props.onUpdateStoreItem(
                this.state.fields.id,
                this.state.fields.code,
                this.state.fields.name,
                this.state.fields.sellingPrice,
                () => {
                    this.props.history.replace('/store');
                }
            );
        }
    };

    render() {
        const attachedWrapperClasses = ['u-margin-top-lg'];
        if (!this.props.openedInModal) {
            attachedWrapperClasses.push('wrapper--md');
            attachedWrapperClasses.push('wrapper');
        }

        return (
            <div className={attachedWrapperClasses.join(' ')}>
                <form className="col-form" onSubmit={this.formSubmitHandler}>
                    <div className="col-form__header">Pridat polozku</div>
                    <div className="col-form__group">
                        <label
                            className="col-form__label"
                            htmlFor="add-item-code"
                        >
                            kod
                        </label>
                        <input
                            className="col-form__input"
                            name="code"
                            id="add-item-code"
                            type="text"
                            required
                            autoFocus
                            value={this.state.fields.code}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <label
                            className="col-form__label"
                            htmlFor="add-item-name"
                        >
                            nazov
                        </label>
                        <input
                            className="col-form__input"
                            name="name"
                            id="add-item-name"
                            type="text"
                            required
                            autoFocus
                            value={this.state.fields.name}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <label
                            className="col-form__label"
                            htmlFor="add-item-sellingPrice"
                        >
                            predajna cena
                        </label>
                        <input
                            className="col-form__input"
                            name="sellingPrice"
                            id="add-item-sellingPrice"
                            type="number"
                            step={0.01}
                            required
                            autoFocus
                            value={this.state.fields.sellingPrice}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="col-form__group">
                        <button className="col-form__btn--submit" type="submit">
                            {this.state.update ? 'upravit' : 'pridat'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.store.loading,
        error: state.store.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddStoreItem: (code, name, sellingPrice, cb) =>
            dispatch(actions.addStoreItem(code, name, sellingPrice, cb)),
        onUpdateStoreItem: (id, code, name, sellingPrice, cb) =>
            dispatch(actions.updateStoreItem(id, code, name, sellingPrice, cb)),
        onSetActiveLink: linkname => dispatch(actions.setActiveLink(linkname)),
        onToggleModal: showModal => dispatch(actions.toggleModal(showModal))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddStoreItem);
