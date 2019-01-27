import React, { Component } from "react";
import intl from "react-intl-universal";
import ReactTread from './ReactTread'

export default class HomeRecommend extends Component{
  constructor(props){
    super(props);
    this.intl = intl;
    this.state = {};
    this.name = 'homeRecommend';
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    //绑定方法
    this.getRecommendCoins = controller.getRecommendCoins.bind(controller)
  }
  async componentDidMount(){
    await this.getRecommendCoins()
  }
  componentWillUnmount(){
    this.name = 'leaveHome'
  }
  render(){
    const {controller} = this.props;
    return(
      <div className='home-recommend-pro'>
        <ul className="clearfix">
          {this.state.recommendData && this.state.recommendData.map((v, index) => (
            <li className='home-recommend-pair clearfix' key={index}>
              <ReactTread trends={v.lineData} fillColor="rgba(255,158,47,0.08)" stroke="#ffe9cf"/>
              <p>
                <span>{v.coinName.toUpperCase()}</span>
                <i className={`${v.rise > 0 ? 'up-i' : 'down-i'} home-updown`}>{Number(v.rise).toPercent()}</i>
              </p>
              <b>{controller.language === 'zh-CN' && Number(v.priceCN || 0).format({number: 'legal', style: {name: 'cny'}}) || Number(v.priceEN || 0).format({number: 'legal', style: {name: 'usd'}})}</b>
            </li>
          )) || null}
        </ul>
      </div>
    )
  }
}