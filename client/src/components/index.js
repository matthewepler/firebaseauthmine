import React, { Component } from 'react'
import glamorous from 'glamorous';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications';

import Coach from './protected/Coach'
import Client from './protected/Client'
import Home from './Home';
import Login from './Login'
import Register from './Register'

import logo from '../img/Restoration_Logo_White.png';
import { logout } from '../helpers/auth'
import { colors, database, firebaseAuth } from '../config/constants'


const Wrapper = glamorous.div({
  background: colors.teal,
  borderLeft: '2px solid white',
  borderRight: '2px solid white',
  height: '100vh',
  margin: '0 auto',
  maxWidth: '800px',
  overflow: 'auto',
  textAlign: 'center',
});

const Header = glamorous.header({
  margin: '2rem',
});

const Logo = glamorous.img({
  width: '100px',
});

const SignOut = glamorous.button({
  position: 'absolute',
  right: '100px',
  background: 'transparent',
  border: 'none',
  fontSize: '1.6rem',
  color: 'white'
})

function PrivateRoute ({ component: Component, currentUser, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if(currentUser) {
          // if this user is the ownner of the URL,
          // or the user is a coach (all coaches have access to all users for now)...
          if(currentUser.uid === props.match.params.id || currentUser.userType === 'coach') {
            return <Component {...props} />
          } else {
            return <Redirect to={{pathname: '/login', state: {from: props.location}}} />
          }
        } else {
            return <Redirect to={{pathname: '/login', state: {from: props.location}}} />
          }
      }}
    />
  )
}

function PublicRoute ({component: Component, currentUser, ...rest}) {
  return (
    <Route
      {...rest}
      render={
        (props) => {
          console.log('here', currentUser);
         if (!currentUser) {
           console.log('hope not here')
            return <Component {...props} />
          } else {
            console.log('hopefully here')
            return <Redirect to={`/${currentUser.linkPath}`} />
         }
      }}
    />
  )
}

export default class App extends Component {
  debug = true;
  removeListener = null;

  state = {
    authed: false,
    currentUser: null,
    loading: true,
  }
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        console.log('looking for user with uid:', user.uid);
        this.setState({
          authed: true,
          loading: false,
        }, () => this.checkExistingUsers(user.uid))
      } else {
        this.setState({
          authed: false,
          loading: false,
          currentUser: null,
          key: null,
        })
      }
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  checkExistingUsers = (uid) => {
    // find the user so we can determine what type
    // of user they are and what route to use
    database
      .ref('/users')
      .orderByChild('uid')
      .equalTo(uid)
      .once('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({
            currentUser: Object.values(snapshot.val())[0],
            key: Object.keys(snapshot.val())[0],
          });
          console.log('user found')
          return;
        } else {
          console.log('no user found')
        }
      });
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <Wrapper>
          <Header>
            <Link to="/login">
              <Logo className="logo" src={logo} alt="logo" />
            </Link>
            { this.state.authed && <SignOut onClick={() => logout()}>Sign Out</SignOut>}
          </Header>

          <NotificationContainer/>

          <div className="container">
            <div className="row">
              <Switch>
                <Route exact path='/' component={Home} />
                <PublicRoute authed={this.state.authed} currentUser={this.state.currentUser} path='/login' component={Login} />
                <PublicRoute currentUser={this.state.currentUser} path='/register' component={Register} />
                <PrivateRoute  currentUser={this.state.currentUser} path='/client/:id' component={Client} />
                <PrivateRoute authed={this.state.authed} currentUser={this.state.currentUser} path='/coach/:id' component={Coach} />
                <Route render={() => <h3>404! Sorry bud. </h3>} />
              </Switch>
            </div>
          </div>
        </Wrapper>
      </BrowserRouter>
    );
  }
}
