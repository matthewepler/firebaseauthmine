import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  componentWillMount() {
    this.props.history.push('/login');
  }
  render () {
    return (
      <div>
        <h2>Home</h2>
      </div>
    )
  }
}