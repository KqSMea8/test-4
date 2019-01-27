import React from 'react';
import Logger from './libs/Logger'
import Storage from "./storage";
// const controllerBase = new ControllerBase()

export default class ViewBase extends React.Component {
  constructor(props) {
    super(props);
    this.Logger = Logger
    // this.Storage = Storage;
    // controllerBase.setView(this)
  }

  componentWillMount() {
  
  }

  componentDidMount() {
  
  }

  componentWillUpdate() {

  }


}