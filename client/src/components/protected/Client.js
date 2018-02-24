import React, { Component } from 'react'
import glamorous from 'glamorous';
import map from 'lodash.map';
import DragSortableList from 'react-drag-sortable'

import ActionItem from '../ActionItem';

import { database } from '../../config/constants';
import { setErrorMsg } from '../../helpers/utils';
import { colors } from '../../config/constants';

const Title = glamorous.h2({
  color: colors.darkGrey,
});

const AddButton = glamorous.button('btn btn-primary', {
  ['&&']: {
    backgroundColor: colors.yellow,
    border: 'none',
    color: colors.darkGrey,
    marginBottom: '3rem',
  }
})

export default class Client extends Component {
  id = this.props.match.params.id;
  refString = `/users/${this.id}`
  dbRef = null;

  state = {
    data: null,
    errorMsg: null,
    loading: true,
  }

  componentDidMount() {
    database.ref(this.refString)
      .on('value', snapshot => {
        const data = snapshot.val();
        if(!data) {
          this.setState(setErrorMsg(`Returned user is null.`));
          return;
        }
        this.setState({ data });
      }, err => {
        this.setState(setErrorMsg(`No user with this id could be found.`));
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const newActionRef = database.ref(`${this.refString}/actions`).push();
    newActionRef.set({
      action: this.action.value,
      description: this.description.value,
      timestamp: Date.now(),
    }, () => {
      this.action.value = '';
      this.description.value = '';
    })
  }

  onListSort = (sortedList, dropEvent) => {
    console.log('sortedList', sortedList, dropEvent);
  }

  render () {
    const actions = this.state.data && map(this.state.data.actions, (a, key) => ({
      content: (
        <ActionItem
          action={a.action}
          checked={a.checked}
          description={a.description}
          key={key}
          root={`${this.refString}/actions/${key}`}
          >
        </ActionItem>
      )
    }));

    return !this.state.data ? <h1>Loading</h1> : (
      <div>
        <Title>{this.state.data.name}</Title>

        {
          this.state.errorMsg &&
          <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span className="sr-only">Error:</span>
            &nbsp;{this.state.errorMsg}
          </div>
        }

        <div className="col-sm-6 col-sm-offset-3">
          {/* <h2> Actions List </h2> */}
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input className="form-control" ref={(action) => this.action = action} placeholder="Action"/>
            </div>
            <div className="form-group">
              <input className="form-control" placeholder="Description" ref={(description) => this.description = description} />
            </div>

            <AddButton type="submit">Add</AddButton>
          </form>
        </div>

        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <DragSortableList items={actions} onSort={this.onListSort} dropBackTransitionDuration={0.3} type="vertical"/>
          </div>
        </div>

      </div>
    )
  }
}