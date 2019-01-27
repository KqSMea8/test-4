import React, {Component} from 'react';
import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Terms from './component/Terms' // 服务协议
// import Api from './children/Api' // API文档
import CoinData from "./component/CoinData"; // 币种资料
import Other from "./component/Other"; // 费率标准第二版
import Apply from "./component/CoinApply" // 上币申请
import DownLoad from "./component/Download" // 下载app
import Privacy from "./component/PrivacyItem" // 下载app

import "./style/index.styl"
import "./style/price.styl"

import Translate from '@/core/libs/Translate'
import HelpLang from '../lang'

class Help extends Component {
  constructor(props) {
    super(props);
    this.controller = props.controller;
    // 统计访问量
    // this.sendStatis = props.controller.configController.sendStatis.bind(props.controller.configController)
  }

  componentDidMount() {
    // this.props.sendStatis({
    //   event: 'homeOtherAcitons',//操作代码
    //   type: 'appDownload',//tab
    // })
  }

  render() {
    const terms = () => {
      return <Terms controller={this.controller}/>;
    };

    const privacy = () => {
      return <Privacy controller={this.controller}/>;
    };
    // const api = () => {
    //   return <Api controller={this.controller} sendStatis={this.sendStatis}/>;
    // };
    const coin = ({location, history}) => {
      return <CoinData controller={this.controller} location={location} history={history}/>;
    };
    const other = ({location, match}) => {
      return <Other controller={this.controller} location={location} match={match}/>;
    };
    const apply = ({location, match}) => {
      return <Apply controller={this.controller} location={location} match={match}/>
    };
    const DownLoadCon = ({location, match}) => {
      return <DownLoad controller={this.controller} location={location} match={match}/>
    };

    return <div className="help-wrap-pro" style={{minHeight: `${window.innerHeight - 2.1 * 100}px`}}>
      <div className="route">
        <Switch>
          <Route path={'/terms'} component={terms}/>
          <Route path={'/pricing'} component={other}/>
          <Route path={'/apply'} component={apply}/>
          {/* <Route path={`${match.url}/api`} component={api} /> */}
          <Route path={'/currency'} component={coin}/>
          <Route path={'/privacy'} component={privacy}/>
          <Route path={'/download'} component={DownLoadCon}/>
          <Redirect to={'/terms'}/>
        </Switch>
      </div>
    </div>
  }
}

export default Translate(Help, HelpLang)