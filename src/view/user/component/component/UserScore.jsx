import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import ExchangeViewBase from '@/components/ExchangeViewBase'
import Pagination from '@/common/baseComponent/Pagination/index.jsx'

export default class UserIntegration extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      scoreEnd: 0,
      scoreStart: 0,
      scoreIndex: 0,
      page: 1,
      totalPage: 0,
      levelObj: [
        {level: 'VIP0'},
        {level: 'VIP1', score: '(10000)'},
        {level: 'VIP2', score: '(50000)'},
        {level: 'VIP3', score: '(100000)'},
        {level: 'VIP4', score: '(200000)'},
        {level: 'VIP5', score: '(500000)'},
        {level: 'MVP'}
      ]
    };
    const {controller} = props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    controller.clearUserCreditsNum(); // 清除用户积分数据
    this.state = Object.assign(this.state, controller.initState);
    this.initData = controller.initData.bind(controller); // 获取用户信息
    this.getUserCredits = controller.getUserCredits.bind(controller); // 获取用户积分列表
    this.getUserCreditsNum = controller.getUserCreditsNum.bind(controller) // 获取用户积分数据
  }

  componentWillMount() {

  }

  async componentDidMount() {
    let result = await Promise.all([
      this.initData(),
      this.getUserCredits(0),
      this.getUserCreditsNum()
    ]);
    // 获取数据后进行渲染
    this.setState(Object.assign(this.state, ...result));
    // 计算分数所在区间
    let obj = this.checkNum(this.state.userCreditsNum);
    this.setState({
      scoreEnd: obj.checkEnd,
      scoreStart: obj.checkStart,
      scoreIndex: obj.checkIndex,
      totalPage: this.state.userCredits.totalCount
    });

    // 统计访问量
    // this.props.sendStatis({
    //   event: 'accountActionsPV',//操作代码
    //   type: 'vip',//tab
    // })
  }

  componentWillUpdate(...parmas) {

  }

  checkNum(num) { // 进度条长度获取
    let scoreArr = [0, 10000, 50000, 100000, 200000, 500000, 50000000000000000000000],
        sum = 0,
        index = 0,
        start = 0,
        end = 0;
    for (let i = 0; i < scoreArr.length; i++) {
      sum += scoreArr[i];
      if(sum >= num){
        index = i;
        start = scoreArr[i-1];
        end = scoreArr[i];
        return {checkStart: start, checkEnd: end, checkIndex: index}
      }
    }
  }

  render() {
    return (
      <div className="integration-wrap">
        <h1>{this.intl.get("user-score")}</h1>
        <div className="info clearfix">
          <h2 className="integration-title">{this.intl.get("user-scoreInfo")}</h2>
          <div className="fl progress-con">
            <h3>
              <b>{this.intl.get("user-scoreLevel")}：VIP{this.state.userInfo.level}（{this.intl.get("points")}：{this.state.userCreditsNum}）</b>
              <Link to="/help/pricing" target="_blank">{this.intl.get("user-scoreDetail")}</Link>
            </h3>
            <ul className="clearfix">
              {this.state.levelObj.map((v, index) => (
                <li key={index}>
                  <em>{v.level}</em>
                  <i>{v.score}</i>
                </li>)
              )}
            </ul>
            <div className="progress-line">
              <span style={{left: `${(120 * (this.state.scoreIndex - 1) + ((this.state.userCreditsNum - this.state.scoreStart) / (this.state.scoreEnd - this.state.scoreStart) * 120)) || 0}px`}}>{this.state.userCreditsNum || 0}</span>
              <p style={{width: `${(120 * (this.state.scoreIndex - 1) + ((this.state.userCreditsNum - this.state.scoreStart) / (this.state.scoreEnd - this.state.scoreStart) * 120)) || 0}px`}}></p>
              <ol className="clearfix">{[1, 2, 3, 4, 5].map((v, index) => (<li key={index}></li>))}</ol>
            </div>
          </div>
        </div>
        <div className="item clearfix">
          <h2>{this.intl.get("user-scoreHistory")}</h2>
          <div className="fl">
            <Link to="/help/pricing/score" target="_blank">{this.intl.get("user-scoreGet")}？</Link>
            <table>
              <thead>
              <tr>
                <th>{this.intl.get("user-scoreHave")}</th>
                <th>{this.intl.get("user-action")}</th>
                <th>{this.intl.get("time")}</th>
              </tr>
              </thead>
              <tbody className={Object.keys(this.state.userCredits).length && this.state.userCredits.list && this.state.userCredits.list.length ? '' : 'hide'}>
                {Object.keys(this.state.userCredits).length && this.state.userCredits.list && this.state.userCredits.list.map((v, index) => (<tr key={index}>
                  <td>+{v.gain}</td>
                  <td>{v.operation}</td>
                  <td>{v.createdTime.toDate('yyyy-MM-dd HH:mm:ss')}</td>
                </tr>)) || null}
              </tbody>
            </table>
          </div>
        </div>
        {Object.keys(this.state.userCredits).length && <Pagination total={this.state.totalPage || this.state.userCredits.totalCount || 0}
          pageSize={10}
          showTotal={true}
          onChange={page => {
            this.setState({ page });
            this.getUserCredits(page - 1)
          }}
          currentPage={this.state.page}
          showQuickJumper={true}/> || null}
      </div>
    );
  }
}