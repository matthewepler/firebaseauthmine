import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import glamorous from 'glamorous';
import map from 'lodash.map';
import { auth } from '../helpers/auth';
import { colors, database } from '../config/constants';
import { sendText, sendEmail } from '../helpers/utils';

const Title = glamorous.h2({
  color: colors.darkGrey,
});

const RegisterButton = glamorous.button('btn btn-primary', {
  ['&&']: {
    backgroundColor: colors.yellow,
    border: 'none',
    color: colors.darkGrey,
    marginBottom: '3rem',
  }
})

const SubTitle = glamorous.div({
  fontSize: '2rem',
  ['& .back-link']: {
    color: colors.yellow,
  }
})

const AdminInput = glamorous.input('form-control', {
  ['&&']: {
    background: 'lightgrey',
  }
})

function setErrorMsg(error) {
  return {
    errorMsg: error.message
  }
}

export default class Register extends Component {
  state = { 
    coaches: [],
    errorMsg: null 
  }

  componentDidMount() {
    database.ref('/users')
      .orderByChild('userType')
      .equalTo('coach')
      .on('value', snapshot => {
        this.setState({ coaches: snapshot.val() })
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // const coachObj = JSON.parse(this.coach.value);
    // console.log('coachObj', coachObj);

    auth({
      name: this.name.value,
      email: this.email.value, 
      pw: this.pw.value, 
      phone: this.phone.value, 
      admin: this.admin.value, 
      coach: this.coach.value,
    })
    .then((userDbObj) => {
      sendText({
        ...userDbObj,
        link: window.location.href,
      });
      sendEmail({
        ...userDbObj,
        link: window.location.href,
      })
    })
    .catch(e => this.setState(setErrorMsg(e)))
  }
  render () {
    const coaches = map(this.state.coaches, (coach, key) => {
      const coachObj = { key, ...coach };
      return (
        <option key={coach.uid} value={JSON.stringify(coachObj)}>{coach.name}</option>
      )
    })

    return (
      <div className="col-sm-6 col-sm-offset-3">
        <Title>Register</Title>
        <form onSubmit={this.handleSubmit}>
        <div className="form-group">
            {/* <label>Name</label> */}
            <input className="form-control" ref={(name) => this.name = name} placeholder="Name"/>
          </div>
          <div className="form-group">
            {/* <label>Email</label> */}
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div className="form-group">
            {/* <label>Password</label> */}
            <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          <div className="form-group">
            {/* <label>Phone</label> */}
            <input className="form-control" placeholder="123-456-7890" ref={(phone) => this.phone = phone} />
          </div>
          <div className="form-group">           
            <select id="coachSelect" className="form-control" ref={(coach) => this.coach = coach}>
            <option>Coach's Name</option>
              {coaches}
            </select>
          </div>
          <br />
          <p>For Admin Use Only</p>
          <div className="form-group">
            <AdminInput ref={(admin) => this.admin = admin} />
          </div>
          {
            this.state.errorMsg &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.errorMsg}
            </div>
          }
          <RegisterButton type="submit">Register</RegisterButton>
        </form>
      </div>
    )
  }
}
