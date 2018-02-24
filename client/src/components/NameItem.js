import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import glamorous from 'glamorous';
import { database } from '../config/constants';
import Icon from './Icon';
import deleteIcon from '../img/delete.svg';
import { colors } from '../config/constants';

const IconWrapper = glamorous.div({
  position: 'absolute',
  right: '0px',
  top: '-5px',
})

const ItemWrapper = glamorous.div({
  display: 'flex',
})

const Name = glamorous.div({
  color: 'white',
  fontSize: '3rem',
})

const LinkItem = glamorous(Link)({
  ':hover': {
    textDecorationColor: colors.yellow,
  }
})

const RowItem = glamorous.li({
  listStyle: 'none',
  marginTop: '2rem',
  outline: 'none',
  paddingRight: '80px',
  position: 'relative',
  textAlign: 'left',
  width: '100%',
})


class NameItem extends Component {
  state = {
    hovered: false,
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  }

  handleDeleteClick = () => {
    database.ref(this.props.dbRef).remove();
  }

  render() {
    return (
      <ItemWrapper onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <RowItem>
          <LinkItem to={`/client/${this.props.uid}`}>
            <Name>{this.props.name}</Name>
          </LinkItem>
          {this.props.children}
          {this.state.hovered ?
            <IconWrapper>
              <Icon onClick={this.handleDeleteClick} src={deleteIcon}/>
            </IconWrapper>
          : ''}
        </RowItem>
      </ItemWrapper>
    )
  }
}

export default NameItem;
