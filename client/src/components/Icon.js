import React from 'react';
import glamorous from 'glamorous';

const Wrapper = glamorous.img({
  cursor: 'pointer',
  height: '50px',
  padding: '15px',
  transition: 'all 0.2s',
  width: '50px',
})
const Icon = (props) => (
  <Wrapper src={props.src} onClick={props.onClick}/>
)

export default Icon;
