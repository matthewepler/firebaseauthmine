import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import glamorous from 'glamorous';
import { database } from '../../config/constants'
import { setErrorMsg, snapshotToArray } from '../../helpers/utils';
import NameItem from '../NameItem';

const NameList = glamorous.div({
  margin: 'auto',
  maxWidth: '350px',
  textAlign: 'center',
});


export default class Coach extends Component {
  id = this.props.match.params.id;
  refString = `/users/${this.id}`

  state ={
    clients: [],
    data: null,
    errorMsg: null,
  }

  componentDidMount() {
    // get data on this coach
    database.ref(this.refString)
      .on('value', snapshot => {
        const data = snapshot.val();
        if(!data) {
          this.setState(setErrorMsg(`Returned user is null.`));
          return;
        }    
        this.setState({ data  });
      }, err => {
        this.setState(setErrorMsg(`No user with this id could be found.`));
      })

    // find all users who have this coach
    database
      .ref(`/users`)
      .orderByChild('coachId')
      .equalTo(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({ clients: snapshotToArray(snapshot) });
      });
  }

  render () {
    const clientLinks = this.state.clients.map(c => (
      <NameItem key={c.key} uid={c.key} name={c.name} dbRef={`/users/${c.key}`} />
    ));

    return !this.state.data ? <h1>Loading</h1> : (
      <div>
        <h1>{this.state.data.name}</h1>
      
        {
          this.state.errorMsg &&
          <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span className="sr-only">Error:</span>
            &nbsp;{this.state.errorMsg} 
          </div>
        }

        <NameList>
          {clientLinks}
        </NameList>

      </div>
    )
  }
}