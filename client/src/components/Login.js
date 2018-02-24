import React, { Component } from 'react'
import glamorous from 'glamorous';
import { Link } from 'react-router-dom';
import { login, resetPassword } from '../helpers/auth'
import { colors } from '../config/constants';

const LoginWrapper = glamorous.div({
  textAlign: 'center',
  margin: '0 auto',
  paddingTop: '2rem',
  width: '500px',
});

const Title = glamorous.h2({
  color: colors.darkGrey,
});

const SubTitle = glamorous.div({
  fontSize: '2rem',
  ['& .register-link']: {
    color: colors.yellow,
  }
})

const LoginButton = glamorous.button('btn btn-primary', {
  ['&&']: {
    backgroundColor: colors.yellow,
    border: 'none',
    color: colors.darkGrey,
    marginBottom: '3rem',
  }
})

function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

export default class Login extends Component {
  state = { loginMessage: null }
  handleSubmit = (e) => {
    e.preventDefault()
    login(this.email.value, this.pw.value)
      .catch((error) => {
          this.setState(setErrorMsg('Invalid username/password.'))
        })
  }
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  }
  render () {
    return (
      <LoginWrapper>
        <Title> Login </Title>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          {
            this.state.loginMessage &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage} <a href="#" onClick={this.resetPassword} className="alert-link">Forgot Password?</a>
            </div>
          }
          <LoginButton type="submit">Login</LoginButton>
        </form>

        <SubTitle>
          <p>New? <Link className="register-link" to="/register">Register here!</Link></p>
        </SubTitle>

      </LoginWrapper>
    )
  }
}
