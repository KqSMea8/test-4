import React, {Component} from 'react';

import exchangeViewBase from "@/components/ExchangeViewBase";
import FundTop from './component/FundTop.jsx'
import FundContent from './component/FundContent.jsx'
import FundProblem from './component/FundProblem.jsx'

import "./style/fundHome.styl"

export default class FundHome extends exchangeViewBase {

  static fundListType = [
    [],
    ['unopenList', 'openList'],
    ['overList', 'overList']
  ]

  constructor(props) {
    super(props);
    this.state = {
      openList: [],
      unopenList: [],
      overList: []
    }
    const {controller} = props;
    this.initData = controller.initData.bind(controller); // 获取产品信息
  }

  async componentDidMount() {
    let result = await this.initData(0);
    let fundList = result.fundList.sort((a,b) => a.id - b.id);
    let {openList, unopenList, overList} = fundList.reduce((fundList, fund) =>
      fundList[FundHome.fundListType[fund.isOver][fund.isOpen]].push(fund) && fundList, {openList: [], unopenList: [], overList:[]})
    this.setState({openList, unopenList, overList});
  }

  render() {
    // console.log(11111, this.state)
    const {controller} = this.props;
    return (
      <div className="fund-wrap">
        <FundTop controller={controller}/>
        <div className="fund-home-bottom">
          {this.state.openList.length && <FundContent
            controller={controller}
            fundList={this.state.openList}
            history={this.props.history}
            title={this.intl.get('tlb-open-title')}
            subtitle={this.intl.get('tlb-open-subhead')}
            remindTitle={this.intl.get('tlb-open-remind')}
            btnTitle={this.intl.get('tlb-open-btn')}
            flag={0}
          /> || null}
          {this.state.unopenList.length && <FundContent
            controller={controller}
            fundList={this.state.unopenList}
            history={this.props.history}
            title={this.intl.get('tlb-unopen-title')}
            subtitle={this.intl.get('tlb-unopen-subhead')}
            remindTitle={this.intl.get('tlb-unopen-title')}
            btnTitle={this.intl.get('tlb-unopen-title')}
            flag={0}
          /> || null}
          {this.state.overList.length && <FundContent
            controller={controller}
            fundList={this.state.overList}
            history={this.props.history}
            title={this.intl.get('tlb-over-title')}
            subtitle=''
            remindTitle=''
            btnTitle={this.intl.get('tlb-over-btn')}
            flag={1}
          /> || null}
          <FundProblem lang={controller.configController.language} fundList={[...(this.state.openList || []), ...(this.state.unopenList||[]), ...(this.state.overList || [])]}/>
        </div>
      </div>
    );
  }
}
