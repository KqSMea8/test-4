import React, { Component } from "react";
import intl from "react-intl-universal";
import Filter from '../../../common/Filter'
import History from '../../../common/History'
import {AsyncAll} from '@/core'
import {getQueryFromPath} from '@/config/UrlConfig'

export default class OtcHistory extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    let { controller } = this.props;
    //type缀参可直接设置页面初始的筛选类型（仅1充币有效）
    let type = this.type = getQueryFromPath('type') && Number(getQueryFromPath('type'));
    controller.setView(this);
    // 生成充提币类型及进度的状态码映射表；
    this.staticData = {
      //1充值; 3买入; 4卖出; 11转入 12转出;
      dir: {
        '-1': this.intl.get("all"),
        1: this.intl.get("deposit"),
        3: this.intl.get("asset-buy"),
        4: this.intl.get("asset-sell"),
        11: this.intl.get("asset-in"),
        12: this.intl.get("asset-out"),
      },
      showDir: {
        1: this.intl.get("deposit"),
        3: this.intl.get("asset-buy"),
        4: this.intl.get("asset-sell"),
        11: this.intl.get("asset-in-from"),
        12: this.intl.get("asset-out-to"),
      },
      //0 已完成; 1 进行中; 2 取消 3 超时 4 申诉中 5 强制放币 6 终止交易 7失败",
      status: {
        0: this.intl.get("asset-otc-records-status1"),
        1: this.intl.get("asset-otc-records-status2"),
        2: this.intl.get("asset-otc-records-status3"),
        3: this.intl.get("asset-otc-records-status4"),
        4: this.intl.get("asset-otc-records-status5"),
        5: this.intl.get("asset-otc-records-status6"),
        6: this.intl.get("asset-otc-records-status7"),
        7: this.intl.get("asset-otc-records-status8"),
      }
    };

    // 筛选条件遍历生成selectButton
    let arr = Object.values(this.staticData.dir);
    arr.unshift(arr.splice(-1)[0]);
    this.selectArr = [
      { key:'dir_s',  text: this.intl.get("asset-direction") , valueArr: arr},
      { key:'currency_s', text: this.intl.get("asset-currency") , valueArr: [this.intl.get("all")]},
    ];
    for (const k in this.staticData.dir) {
      this.staticData.dir[this.staticData.dir[k]] = Number(k);
    }

    this.state = {
      page: 1,
      pageSize: 20,
      // 搜索条件
      currency: this.intl.get("all"),
      dir: [1].includes(type) && this.staticData.dir[type] || this.intl.get("all"),
      startTime: this.dealTime().start,
      endTime: this.dealTime().end,
      //选择条件
      currency_s: this.intl.get("all"),
      dir_s: [1].includes(type) && this.staticData.dir[type] || this.intl.get("all"),
      startTime_s: this.dealTime().start,
      endTime_s: this.dealTime().end
    };
    let { walletList, assetHistory } = controller.initState;
    this.state = Object.assign(this.state, {
      walletList,
      assetHistory
    });
    //绑定方法
    this.getOtcHistory = controller.getOtcHistory.bind(controller);
    this.getOtcWalletList = controller.getOtcWalletList.bind(controller);
  }

  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'records',//tab
    // })
    let result = await AsyncAll([this.getOtcWalletList(),this.getOtcHistory(
      {
        page: 0,
        pageSize: this.state.pageSize,
        dir: [1].includes(this.type) && this.type || -1,
        startTime: this.dealTime().start,
        endTime: this.dealTime().end
      })
    ]);

    //处理出筛选币种列表
    this.selectArr[1].valueArr = Object.keys(result[0].walletList).sort((a,b)=> a>b ? 1 : -1)
    this.selectArr[1].valueArr.unshift(this.intl.get("all"))

    this.setState(Object.assign({}, ...result))
  }

  componentWillUnmount(){
    this.props.controller.initHistory();
  }

  // 处理出默认时间
  dealTime = () => {
    let now = new Date();
    let start =
      new Date(now.getFullYear(), now.getMonth(), now.getDate()) - 604800000;
    let end =
      new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
      0 +
      86399999;
    return {
      start: parseInt(start / 1000),
      end: parseInt(end / 1000)
    }
  };

  // 重置搜索
  initSearch = () => {
    this.setState(
      {
        page: 1,
        currency: this.intl.get("all"),
        dir: this.intl.get("all"),
        startTime: this.dealTime().start,
        endTime: this.dealTime().end,
        currency_s: this.intl.get("all"),
        dir_s: this.intl.get("all"),
        startTime_s: this.dealTime().start,
        endTime_s: this.dealTime().end
      },
      () => {
        this.search(0);
      }
    );
  };

//select方法
  select = (value) => {
    this.setState(value);
  };

//搜索方法
  search = async (page) => {
    let { currency, dir, startTime, endTime, pageSize } = this.state;
    let result = await this.getOtcHistory({
      coinName: currency === this.intl.get("all") ? undefined : currency.toLowerCase(),
      dir: this.staticData.dir[dir],
      startTime: startTime,
      endTime: endTime,
      page: page,
      pageSize: pageSize
    });
    this.setState(result)
  };

  // 搜索按钮点击处理
  searchHandle = () => {
    this.setState({
      page: 1,
      currency: this.state.currency_s,
      dir: this.state.dir_s,
      startTime: this.state.startTime_s,
      endTime: this.state.endTime_s
    },()=>{
      this.search(0);
    })
  };

  // reset
  resetHandle = () => {
    this.initSearch();
  };

  //翻页
  changePage = page => {
    this.setState({
      page,
      currency_s: this.state.currency,
      dir_s: this.state.dir,
      startTime_s: this.state.startTime,
      endTime_s: this.state.endTime
    });
    this.search(page - 1)
  };

  //修改开始时间
  onChangeStart = time => this.setState({ startTime_s: parseInt(time / 1000) });
  //修改结束时间
  onChangeEnd = time => this.setState({ endTime_s: parseInt(time / 1000) });

  render() {
    let { orderList } = this.state.assetHistory;
    return (
      <div className="hist">
        <Filter
          selectArr={this.selectArr}
          currency_s={this.state.currency_s}
          dir_s={this.state.dir_s}
          select={this.select}
          startTime_s={this.state.startTime_s}
          endTime_s={this.state.endTime_s}
          onChangeStart={this.onChangeStart}
          onChangeEnd={this.onChangeEnd}
          searchHandle={this.searchHandle}
          resetHandle={this.resetHandle}
        />
        <History
          orderList={orderList}
          status={this.staticData.status}
          dir={this.staticData.showDir}
          total={this.state.assetHistory.total}
          pageSize={this.state.pageSize}
          changePage={this.changePage}
          page={this.state.page}
        />
      </div>
    );
  }
}
