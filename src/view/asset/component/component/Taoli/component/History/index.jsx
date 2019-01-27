import React, { Component } from "react";
import History from '../../../common/History'
import {AsyncAll} from '@/core'
import intl from "react-intl-universal";

export default class OtcHistory extends Component {
  constructor(props) {
    super(props);
    let { controller } = this.props;
    // type缀参可直接设置页面初始的筛选类型（仅1充币有效）统计用
    // let type = this.type = getQueryFromPath('type') && Number(getQueryFromPath('type'));
    controller.setView(this);
    this.intl = intl;
    // 生成充提币类型及进度的状态码映射表；
    this.staticData = {
      //'类型 0:购买 1:赎回 2: 转至币币账户 3：由币币账户转入'
      dir: {
        3: this.intl.get("asset-redeem"),
        4: this.intl.get("asset-subscribe"),
        11: this.intl.get("asset-in"),
        12: this.intl.get("asset-out"),
      },
    };
    this.state = {
      page: 1,
      pageSize: 20,
    };
    let { fundHistory } = controller.initState;
    this.state = Object.assign(this.state, {
      assetHistory: fundHistory
    });
    //绑定方法
    this.getFundHistory = controller.getFundHistory.bind(controller);
  }

  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'records',//tab
    // })
    let result = await AsyncAll([this.getFundHistory(
      {
        page: 1,
        pageSize: this.state.pageSize,
      })
    ]);
    this.setState(Object.assign({}, ...result))
  }

  componentWillUnmount(){
    this.props.controller.initHistory();
  }

//搜索方法
  search = async (page) => {
    let { pageSize } = this.state;
    let result = await this.getFundHistory({
      page,
      pageSize,
    });
    // console.log()
    this.setState(result)
  };

  //翻页
  changePage = page => {
    this.setState({
      page,
    });
    this.search(page);
  };

  render() {
    let { orderList } = this.state.assetHistory;
    return (
      <div className="hist">
        <History
          orderList={orderList}
          status={this.staticData.status}
          dir={this.staticData.dir}
          total={this.state.assetHistory.total}
          pageSize={this.state.pageSize}
          changePage={this.changePage}
          page={this.state.page}
        />
      </div>
    );
  }
}
