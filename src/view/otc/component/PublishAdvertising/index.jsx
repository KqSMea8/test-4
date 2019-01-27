import React, { Component } from "react";
import AdExplain from "./components/AdExplain";
import AdForm from "./components/AdForm";
import "./stylus/index.styl";

export default class PublishAdvertising extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: 0, //0 出售，1 购买
      hasStore: false
    };

    this.hasStore = props.controller.userController.hasStore.bind(props.controller.userController)
  }

  async componentDidMount() {
    let result = await this.hasStore();
    if(result === true) {
      this.setState({hasStore: true})
      return;
    }
    this.props.history.push('/advertisingList');
  }


  render() {
    return (
      this.state.hasStore ? <div className="publish-ad clearfix">
          <div className="publish-ad-left">
            <AdExplain/>
          </div>
          <div className="publish-ad-right">
            <AdForm controller={this.props.controller} history={this.props.history}/>
          </div>
        </div>
        :
        <div/>
    );
  }
}
