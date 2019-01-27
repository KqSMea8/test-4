import React, { Component } from "react";
import intl from "react-intl-universal";
import Pagination from '@/common/baseComponent/Pagination/index.jsx'
import UserNoticeContent from './component/UserNoticePop.jsx'
import "./style/userNotice.styl"

import Translate from '@/core/libs/Translate'
import UserNoticeLang from '../lang'

class UserNotice extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      userNoticePop: false, // 控制详细内容弹窗
      userContent: "", // 每条详细内容
      userNotice: {}, // 列表信息
      page: 1, // 第几页
      totalPage: 0 // 分页总数
    };
    const {controller} = props;
    //绑定view
    controller.setView(this);
    controller.clearUserNotice(); // 清除store中的userNotice数据
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.getUserNotice = controller.getUserNotice.bind(controller); // 获取通知列表
    this.upDateUserNoctice = controller.upDateUserNoctice.bind(controller);  // 改变未读状态
    this.changeHeaderNotice = controller.changeHeaderNotice.bind(controller); // 改变头部信息
    // 访问统计量
    // this.sendStatis = controller.configController.sendStatis.bind(controller.configController)
  }

  async componentDidMount() {
    await this.getUserNotice(0, 0, 15);
    this.setState({
      totalPage: this.state.userNotice && this.state.userNotice.totalCount || 0
    });
    // 访问统计量
    // this.sendStatis({
    //   event: 'notificationPV', //操作代码
    //   type: 'userNotice', //tab
    // })
  }

  showContent(v, i) { // 详细内容
    let userNotice = this.state.userNotice;
    if (userNotice.list[i].isRead === 0){
      this.changeHeaderNotice(v);
      userNotice.list[i].isRead = 1;
      this.upDateUserNoctice(v.id)
    }
    this.setState({
      userNoticePop: true,
      userContent: this.props.controller.configData.language === 'zh-CN' ? v.content.contentCN : v.content.contentEN,
      userNotice
    })
  }

  render() {
    let userNotice = this.state.userNotice && this.state.userNotice.list || [];
    return (
      <div className="user-notice-wrap" style={{minHeight: `${window.innerHeight - 2.1 * 100 - 60}px`}}>
        <h1>{this.intl.get("userNotice")}</h1>
        <div className="table-div">
          {userNotice.length > 0 ? (<ul>
            {userNotice.map((v, index) => (
              <li key={index} onClick={value => this.showContent(v, index)} className="clearfix">
                <p>
                  <b className={`${v.isRead === 0 ? '' : 'no-read'} read-flag`}></b>
                  <span>{this.props.controller.configData.language === 'zh-CN' ? v.content.contentCN.replace(/<br\s*\/>/g,'...') : v.content.contentEN.replace(/<br\s*\/>/g,'...')}</span>
                </p>
                <i>{v.createAt.toDate('yyyy-MM-dd HH:mm:ss')}</i>
              </li>))}
            </ul> || null) : (<p className="nothing-text">{this.intl.get("notice-none")}</p> || null)
          }
        </div>
        {userNotice.length && <Pagination total={this.state.totalPage  || this.state.userNotice.totalCount || 0}
          pageSize={15}
          showTotal={true}
          onChange={page => {
            this.setState({ page });
            this.getUserNotice(0, page-1, 15)
          }}
          currentPage={this.state.page}
          showQuickJumper={true}
        /> || null}
        {this.state.userNoticePop && <UserNoticeContent
          onClose={() => {this.setState({ userNoticePop: false });}}
          content={this.state.userContent}
        />}
      </div>
    );
  }
}

export default Translate(UserNotice, UserNoticeLang)
