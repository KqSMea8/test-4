import React, { Component } from "react";
import intl from "react-intl-universal";

export default class HomeActivityBanner extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      left1: 0,
      left2: 300,
      criticalArr: [0, 100],
      pointActive: 0,
      homeBanner: [],
    };

    this.changeWidth = () => {
      let bannerImg = Array.from(document.getElementsByClassName('banner-img'));
      bannerImg.forEach(v => {
        v.style.width = `${document.body.clientWidth}px`
      })
    };

    const {controller} = props;
    // 绑定view
    controller.setView(this);
    // 初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.getHomeBanner = controller.getHomeBanner.bind(controller);
    this.selectBanner = this.selectBanner.bind(this)
  }

  selectBanner(index) { // 点击圆点切换
    this.props.controller.swiperStop("bannerSwiper");
    let result = this.state.homeBanner && this.state.homeBanner.length && this.state.homeBanner || [];
    if (result.length) {
      this.setState({
          pointActive: index,
          left1: index * -100,
          left2: (-index + result.length) * 100,
          criticalArr: Array.from(
            {length: Math.ceil(result.length + 1)},
            (item, index) => index * 100
          )
        },
        () => {
          this.props.controller.swiper(
            "bannerSwiper",
            this,
            "left1",
            "left2",
            this.state.criticalArr,
            10,
            5000,
            (a, b) => {
              this.setState({
                pointActive: this.state.criticalArr.indexOf(Math.min((result.length * 100 - a), (result.length * 100 - b)))
              })
            }
          );
        }
      );
    }
  }

  async componentDidMount() {
    // status 1 进行中  2未开始   3已过期  0获取所有类型
    // position 0 首页  1活动页
    // it 1-lang,2-h5
    window.addEventListener("resize", this.changeWidth);
    await this.getHomeBanner(1, 1, 1);
    let result = this.state.homeBanner && this.state.homeBanner.length && this.state.homeBanner || [];
    if (result.length && result.length > 1) {
      this.setState({
          left2: Math.ceil(result.length) * 100,
          criticalArr: Array.from(
            {length: Math.ceil(result.length+1)},
            (item, index) => index * 100
          )
        },
        () => {
          this.props.controller.swiper(
            "bannerSwiper",
            this,
            "left1",
            "left2",
            this.state.criticalArr,
            10,
            5000,
            (a, b) => {
              this.setState({
                pointActive: this.state.criticalArr.indexOf(Math.min((result.length * 100 - a), (result.length * 100 - b))),
              })
            }
          );
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.controller.swiperClear("bannerSwiper");
    window.removeEventListener("resize", this.changeWidth);
  }

  render() {
    let lang = this.props.controller.configController.language;
    let homeBanner = this.state.homeBanner || [];
    let hB = {"zh-CN": homeBanner.bc, "en-US": homeBanner.be}[lang] || ""; // 背景图片
    let hT = {"zh-CN": homeBanner.tc, "en-US": homeBanner.te}[lang] || ""; // 标题图片
    return (
      <div className='home-activity-banner-wrap-pro'>
        {/*style={{height: `${document.body.clientWidth * 470 / 1440}px`}}*/}
        <div className='home-banner-ct'>
          <div className='images clearfix'
               style={{width: `${document.body.clientWidth * homeBanner.length}px`, minWidth: `${1200 * homeBanner.length}px`, left: `${this.state.left1}%`}}>
            {homeBanner.length && homeBanner.map((v, index) => {
              return (
                <div key={index}
                     style={{
                       background: `url(${lang === 'zh-CN' ? v.bc : v.be}) center center / cover no-repeat`,
                       width: `${document.body.clientWidth}px`,
                       minWidth: '1200px'
                     }}
                     className="banner-img">
                  <a href={v.url ? v.url : 'javascript:void(0)'} target="_blank" className={`${v.url ? 'click-a' : ''} img-a`}>
                    {(v.tc || v.te) && <img src={lang === 'zh-CN' ? v.tc : v.te}/>}
                  </a>
                </div>
              )
            }) || null}
          </div>
          {homeBanner.length && homeBanner.length > 1 && <div className='images clearfix'
               style={{width: `${document.body.clientWidth * homeBanner.length}px`, minWidth: `${1200 * homeBanner.length}px`, left: `${this.state.left2}%`}}>
            {homeBanner.length && homeBanner.length > 1 && homeBanner.map((v, index) => {
              return (
                <div key={index}
                     style={{
                       background: `url(${lang === 'zh-CN' ? v.bc : v.be}) center center / cover no-repeat`,
                       width: `${document.body.clientWidth}px`,
                       minWidth: '1200px'
                     }}
                     className="banner-img">
                  <a href={v.url ? v.url : 'javascript:void(0)'} target="_blank" className={`${v.url ? 'click-a' : ''} img-a`}>
                    {(v.tc || v.te) && <img src={lang === 'zh-CN' ? v.tc : v.te}/>}
                  </a>
                </div>
              )
            })}
          </div> || null}
          {homeBanner.length && homeBanner.length > 1 && <ol className="point">
            {homeBanner.length && homeBanner.length > 1 && homeBanner.map((v, index) => (
              <li key={index}
                  className={this.state.pointActive === index ? 'active' : ''}
                  onClick={state => this.selectBanner(index)}></li>
            ))}
          </ol> || null}
        </div>
      </div>
    );
  }
}
