import React, { Component } from 'react';
import glamorous from 'glamorous';
import { database } from '../config/constants';
import Icon from '../components/Icon';
import deleteIcon from '../img/delete.svg';

const ItemWrapper = glamorous.div({
  display: 'flex',
})

const Action = glamorous.h4(props => ({
  color: 'white',
  fontSize: '2.4rem',
  paddingLeft:'50px',
  textAlign: 'left',
  textDecoration: `${props.checked ? 'line-through' : 'none'}`,
  width: '90%',
}))

const RowItem = glamorous.li({
  borderBottom: '1px solid white',
  flex: 1,
  listStyle: 'none',
  marginTop: '2rem',
  position: 'relative'
})

const IconWrapper = glamorous.div({
  position: 'absolute',
  right: '0px',
  top: '-5px',
})

const Check = glamorous.span(props => ({
  backgroundColor: `${props.checked ? 'white': 'transparent'}`,
  border: '2px solid white',
  borderRadius: '50%',
  left: 0,
  position: 'absolute',
  height: '25px',
  top: '10px',
  width: '25px',
}))

const DescriptionText = glamorous.p({
  fontSize: '1.7rem',
  paddingLeft: '50px',
  textAlign: 'left',
})

class ActionItem extends Component {
  state = {
    hovered: false,
    checked: this.props.checked || false,
  }

  updateItem = (e) => {
    if (e) e.preventDefault();
   
    database.ref(this.props.root).update({
      checked: this.state.checked,
    });
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  }

  handleCheckboxClick = () => {
    // should update in DB and then sync to state via evenListener in DidMount();
    this.setState(prevState => ({
      checked: !prevState.checked
    }), () => {
      this.updateItem();
    });
  }

  handleDeleteClick = () => {
    database.ref(this.props.root).remove();
  }

  render() {
    return (
      <ItemWrapper onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          <RowItem>
             <Check
              checked={this.state.checked}
              onClick={this.handleCheckboxClick}
            />

            <div>
              <Action checked={this.props.checked}>{this.props.action}</Action>
              <DescriptionText>{this.props.description}</DescriptionText>
            </div>

            {this.state.hovered ?
              <IconWrapper>
                <Icon
                  onClick={this.handleDeleteClick}
                  src={deleteIcon}/>
              </IconWrapper>
            : ''}
          </RowItem>
      </ItemWrapper>
    )
  }
}

export default ActionItem;
