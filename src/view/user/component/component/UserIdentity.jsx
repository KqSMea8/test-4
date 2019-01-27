import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import ExchangeViewBase from '@/components/ExchangeViewBase'
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import RemindPopup from '@/common/baseComponent/Popup/index.jsx'
import Server from '@/config/ServerConfig'
import {Regular} from '@/core'
import {
  USER_ADD,
  USER_DRIVER01,
  USER_DRIVER02,
  USER_DRIVER03,
  USER_ID01,
  USER_ID02,
  USER_ID03,
  USER_PASSPORT01,
  USER_PASSPORT02,
  USER_PASSPORT03,
  USER_ERR,
  USER_NO,
  USER_PROGRESS,
  USER_SUCC,
  COMMON_RADIO,
  COMMON_RADIO_GET,
  USER_LOADING,
  COMMON_CHECKBOX_SELECT,
  COMMON_CHECKBOX_NORMAL
} from '@/config/ImageConfig'

export default class UserIdentity extends ExchangeViewBase {
  constructor(props) {
    super(props);

    this.inputArr = [ // 输入框提示语
      this.intl.get("user-fillId"),
      this.intl.get("user-fillDriver"),
      this.intl.get("user-fillPassport")
    ];

    this.typeNameList = [ // 证件类型
      this.intl.get("user-idCard"),
      this.intl.get("user-driver"),
      this.intl.get("user-passport")
    ];

    this.reqList = [ // 上传证件要求
      {value: this.intl.get("user-req1")},
      {value: this.intl.get("user-req2")},
      {value: this.intl.get("user-req6"), showFlag: 'en-US'},
      {value: this.intl.get("user-req3")},
      {value: this.intl.get("user-req4")},
      {value: this.intl.get("user-req5")}
    ]

    this.state = {
      verifyTypeArr: [ // 选择类型
        {name: this.intl.get("user-idCard"), type: 1},
        {name: this.intl.get("user-passport"), type: 3},
        {name: this.intl.get("user-driver"), type: 2, showFlag: 'en-US'}
      ],
      selectIndex: 0, //  选择身份证护照index
      imgUrlIndex: 0, // 上传证件照index
      showPhotoList:['', '', ''], // 存储照片用
      firstNameValue: '', // 姓氏输入框
      lastNameValue: '',
      numberValue: '',
      image1: '', // 上传照片用于存储ID
      image2: '', // 上传照片用于存储ID
      image3: '', // 上传照片用于存储ID
      remindPopup: false,
      popType: '',
      popMsg: '',
      checkVerifyArr: true, // 单选是否能够点击
      checkState: false, // 同意协议单选框按钮
      errNum: '',
      photoArr: [
        {
          photoList: [
            {imgUrl: USER_ID01, name: this.intl.get("user-idFront"), cNname: this.intl.get("user-idFront")},
            {imgUrl: USER_ID02, name: this.intl.get("user-idBack"), cNname: this.intl.get("user-idBack")},
            {imgUrl: USER_ID03, name: this.intl.get("user-idHand"), cNname: this.intl.get("user-idHand")}
          ]
        },
        {
          photoList: [
            {imgUrl: USER_PASSPORT01, name: this.intl.get("user-passFront"), cNname: this.intl.get("user-passFront")},
            {imgUrl: USER_PASSPORT02, name: this.intl.get("user-passHand"), cNname: this.intl.get("user-passHand")},
            {imgUrl: USER_PASSPORT03, name: this.intl.get("user-addr"), cNname: this.intl.get("user-addr")}
          ]
        },
        {
          photoList: [
            {imgUrl: USER_DRIVER01, name: this.intl.get("user-driverFront"), cNname: ''},
            {imgUrl: USER_DRIVER02, name: this.intl.get("user-driverBack"), cNname: ''},
            {imgUrl: USER_DRIVER03, name: this.intl.get("user-driverHand"), cNname: ''}
          ]
        },
      ],
      realNameArr: [ // 是否认证:0未认证;1审核中;2已审核;3未通过;4恶意上传失败封锁3天;5永久禁止
        {imgUrl: USER_NO, content: this.intl.get("user-authNo")},
        {imgUrl: USER_PROGRESS, content: this.intl.get("user-authProcess")},
        {imgUrl: USER_SUCC, content: this.intl.get("user-authSucc")},
        {imgUrl: USER_ERR, content: this.intl.get("user-authErr")},
        {imgUrl: USER_ERR, content: this.intl.get("user-authErr")},
        {imgUrl: USER_ERR, content: this.intl.get("user-authErr")},
      ],
      errCode: 0,
      errState: ''
    };
    const {controller} = props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);

    this.getUserAuthData = controller.getUserAuthData.bind(controller); // 获取用户认证信息
    this.uploadInfo = controller.uploadInfo.bind(controller); // 上传实名信息
    this.uploadImg = controller.uploadImg.bind(controller); // 上传图片
  }

  componentWillMount() {

  }

  async componentDidMount() {
    // 获得初始信息
    let result = await this.getUserAuthData(),
        userAuth = result.userAuth,
        state = {};
    userAuth.type = userAuth.type ? userAuth.type : 1; // 若无type将type默认值变为身份证类型
    state = Object.assign(this.state, result);
    // 失败情况下照片处理
    if ([3, 4, 5].includes(userAuth.state)) {
      let typyArr = [0, 0, 2, 1];
      state = Object.assign(state, {
        checkState: true,
        selectIndex: typyArr[userAuth.type],
        showPhotoList: [
          `${Server.hSecure && 'https' || 'http'}://${Server.host}/v1/usimage/thumb/${userAuth.image1}`,
          `${Server.hSecure && 'https' || 'http'}://${Server.host}/v1/usimage/thumb/${userAuth.image2}`,
          `${Server.hSecure && 'https' || 'http'}://${Server.host}/v1/usimage/thumb/${userAuth.image3}`
        ],
        image1: userAuth.image1, // 上传照片用于存储ID
        image2: userAuth.image2, // 上传照片用于存储ID
        image3: userAuth.image3, // 上传照片用于
      })
    }
    // 不是未认证不能选择类型
    userAuth.state !== 0 && (
      state = Object.assign(state, {
        checkVerifyArr: false
      })
    );

    // 姓名分离
    if (userAuth.firstName === '' || userAuth.lastName === '') {
      let fullName = userAuth.fullName,
          firstName = fullName.substring(0, 1),
          lastName = fullName.substring(1);
      userAuth.firstName = firstName;
      userAuth.lastName = lastName;
      state = Object.assign(state, {
        userAuth
      })
    }

    this.setState(state)

    // 统计访问量
    // this.props.sendStatis({
    //   event: 'accountActionsPV', //操作代码
    //   type: 'verification', //tab
    // })
  }

  componentWillUpdate(...parmas) {

  }

  getObjectURL (file) { // 图片预览选择
    let url = null ;
    if (window.createObjectURL!=undefined) { // basic
      url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
  }

   selectPhoto = () => { // input上传图片
    let file = this.refs.files.files[0];
    if(!file) return; // 无图片处理
    if(file && file.size > 10485760) { // 大于10M处理
      this.setState({
        remindPopup: true,
        popType: "tip3",
        popMsg: this.intl.get("user-bigPicture"),
      });
      return
    }
    this.state.showPhotoList[this.state.imgUrlIndex] = this.getObjectURL(file);
    this.setState({
      showPhotoList: this.state.showPhotoList.concat([]),
      [`image${this.state.imgUrlIndex + 1}`]: ''
    });
    // this.refs.files.value = '';
    this.uploadImg(file)
  };

  checkPhoto(i) { // 点击不同图片
    this.setState({
      imgUrlIndex: i
    }, () => this.refs.files.click())
  }

  selectVerifyType(index, content) { // 单选切换
    this.setState({
      userAuth: Object.assign(this.state.userAuth, {type: content.type}),
      selectIndex: index,
      numberValue: "",
      errNum: "",
      showPhotoList: ['', '', ''], // 存储照片用
    })
  }

  firstInput(value) {
    // value = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')
    this.setState({firstNameValue: value.trim()});
  }

  lastInput(value) {
    // value = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')
    this.setState({lastNameValue: value.trim()});
  }

  numberInput(value) {
    this.setState({numberValue: value.trim()});
    this.state.errNum && (this.setState({errNum: ""}));
    // this.state.errState && (this.setState({errState: "", errCode: 0}))
  }

  checkNumber = () => { // 检查身份证、护照信息
    let reg1 = Regular('regId', this.state.numberValue),
        reg2 = Regular('regPassPort1', this.state.numberValue),
        reg3 = Regular('regPassPort2', this.state.numberValue),
        userAuth = this.state.userAuth,
        language = this.props.controller.configController.language;
    if (userAuth.type === 1 && language === 'zh-CN') { // 身份证
      if(!reg1) {
        this.setState({
          errNum: this.intl.get("user-idErr")
        })
      }
    }
    if (userAuth.type === 3) { // 护照
      if(!reg2 && !reg3) {
        this.setState({
          errNum: this.intl.get("user-passportErr")
        })
      }
    }
  };

  checkAgree = () => { // 控制单选按钮
    this.setState({
      checkState: !this.state.checkState
    })
  };

  uploadImgInfo = () => { // 确认提交
    let firstName, lastName, name, type, num, img1, img2, img3, userAuth = this.state.userAuth;
    firstName = userAuth.number ? userAuth.firstName : this.state.firstNameValue; // 姓氏
    lastName =  userAuth.number ? userAuth.lastName : this.state.lastNameValue; // 名字
    name = userAuth.number ? `${userAuth.firstName}${userAuth.lastName}` : `${this.state.firstNameValue}${this.state.lastNameValue}`; // 名字
    type = userAuth.type; // 0：无 1：身份证 2：驾照 3：护照
    num = userAuth.number ? userAuth.number : this.state.numberValue; // 证件号
    img1 = this.state.image1 || userAuth.image1; // 正面照
    img2 = this.state.image2 || userAuth.image2; // 背面照
    img3 = this.state.image3 || userAuth.image3;  // 手持照
    this.uploadInfo(firstName, lastName, name, type, num, img1, img2, img3)
  };

  canClick = () => {  // 能否点击
    let userAuth = this.state.userAuth;
    if (this.state.errNum) return false;
    if ((userAuth.state === 0) &&  this.state.checkState && this.state.firstNameValue && this.state.lastNameValue && this.state.numberValue && this.state.image1 && this.state.image2 && this.state.image3) return true;
    if ((userAuth.state === 3 || userAuth.state === 4 || userAuth.state === 5) && this.state.checkState && (userAuth.image1 || this.state.image1) && (userAuth.image2 || this.state.image2) && (userAuth.image3 || this.state.image3)) return true;
    return false
  };

  render() {
    let number = this.state.userAuth.number,
        language = this.props.controller.configController.language,
        hideNum = [
          number && number.replace(/(\d{3})\d{9,12}(\d{3})/, "$1****$2"), // 身份证隐藏规则
          number && number.replace(/(\w{3})\w{1,13}(\w{3})/, "$1****$2"), // 驾照隐藏规则
          number && number.replace(/(\w{2})\w{1,13}(\w{2})/, "$1***$2") // 护照隐藏规则
        ];
    return (
      <div className="identify-wrap">
        <h1>{this.intl.get("header-idVerify")}</h1>
        <div className="identify-result">
          <img src={this.state.realNameArr[this.state.userAuth.state] && this.state.realNameArr[this.state.userAuth.state].imgUrl} alt="" />
          <span>{this.state.realNameArr[this.state.userAuth.state] && this.state.realNameArr[this.state.userAuth.state].content}</span>
        </div>
        <div className="name-identify clearfix">
          <h2>{this.intl.get("user-name")}</h2>
          <div className="fl">
            <span>{this.intl.getHTML("user-nameRemind")}</span>
            <div className="clearfix">
              <ul>
                <li>{this.intl.get("user-surname")}</li>
                <li>
                  <Input placeholder={this.intl.get("user-inputSurname")}
                         value={this.state.userAuth.firstName ? this.state.userAuth.firstName : this.state.firstNameValue}
                         disabled ={this.state.userAuth.firstName ? true : false}
                         onInput={value => this.firstInput(value)}
                  />
                </li>
              </ul>
              <ul>
                <li>{this.intl.get("user-forename")}</li>
                <li>
                  <Input placeholder={this.intl.get("user-inputForename")}
                         value={this.state.userAuth.lastName ? this.state.userAuth.lastName : this.state.lastNameValue}
                         disabled ={this.state.userAuth.lastName ? true : false}
                         onInput={value => this.lastInput(value)}
                  />
                </li>
              </ul>
            </div>
            <dl className="clearfix">
              <dt>{this.intl.get("user-name")}</dt>
              {this.state.verifyTypeArr.map((item, index) => (!item.showFlag || item.showFlag === language) && (
                <dd key={index} onClick={content => this.state.checkVerifyArr && this.selectVerifyType(index, item)}>
                  {this.state.userAuth.type === item.type ? <img src={COMMON_RADIO_GET} alt=""/> : <img src={COMMON_RADIO} alt="" />}
                  <i>{item.name}</i>
                </dd>
              ) || null )}
            </dl>
            <div className="err-parent">
              <Input placeholder={this.inputArr[this.state.userAuth.type - 1]}
                     className="id-input"
                     value={this.state.userAuth.number ? (hideNum[this.state.userAuth.type - 1]) : this.state.numberValue}
                     disabled ={this.state.userAuth.number ? true : false}
                     onInput={value => this.numberInput(value)}
                     onBlur={this.checkNumber}
              />
              {this.state.numberValue && this.state.errNum && <em className="number-err err-children">{this.state.errNum}</em>}
              {/*{[109].includes(this.state.errCode) && this.state.errState && <em className="number-err err-children">{this.state.errState}</em>}*/}
            </div>
          </div>
        </div>
        <div className="photo-identify clearfix">
          <h2>{this.intl.get("user-photoVerify")}</h2>
          {this.state.userAuth.state === 1 && <div className="fl"><em className="auth-res">{this.intl.get("user-authProRes")}</em></div>}
          {this.state.userAuth.state === 2 && <div className="fl"><em className="auth-res">{this.intl.get("user-authSuccRes")}</em></div>}
          {[0, 3, 4, 5].includes(this.state.userAuth.state) && <div className="fl">
            <dl className="user-photoVerify-req">
              <dt>{this.intl.get("user-idReq")}</dt>
              {this.reqList.map((item, index) => (!item.showFlag || item.showFlag === language) && (
                <dd key={index} className={index === 5 ? 'user-req4' : ''}>
                  {`${(index > 2 && language === 'zh-CN') ? index : index + 1}. ${item.value}`}
                </dd>
              ) || null)}
            </dl>
            {this.state.userAuth.state === 0 && <dl className="clearfix user-photoVerify-type">
              <dt>{this.intl.get("user-type")}</dt>
              <dd>{this.typeNameList[this.state.userAuth.type - 1]}</dd>
            </dl>}
            <dl className="clearfix user-photoVerify-upload">
              <dt>{this.intl.get("upLoad")}{this.intl.get("user-photo")}</dt>
              {this.state.photoArr[this.state.selectIndex].photoList && this.state.photoArr[this.state.selectIndex].photoList.map((item, index) => (<dd key={index} onClick={i => this.checkPhoto(index)}>
                {this.state.showPhotoList[index] ? <img src={`${this.state.showPhotoList[index]}`} alt="" className="up-img"/> : <img src={item.imgUrl} alt="" />}
                <img src={USER_ADD} alt="" className="add-img"/>
                {this.state.showPhotoList[index] !== '' && this.state[`image${index + 1}`] === '' && <div className="loading-wrap">
                  <img src={USER_LOADING} alt="" />
                </div>}
                <p>{language === 'zh-CN' ? item.cNname : item.name}</p>
              </dd>))}
            </dl>
            <h3>
              <p onClick={this.checkAgree}>
                {this.state.checkState ? (<img src={COMMON_CHECKBOX_SELECT} alt=""/>) : (<img src={COMMON_CHECKBOX_NORMAL} alt=""/>)}
              </p>
              {this.intl.get("user-photoSure")}
            </h3>
            <Button
              title={this.intl.get("user-submit")}
              className={`${this.canClick() ? 'identify-btn-active' : ''} identify-btn`}
              disable={this.canClick() ? false : true}
              onClick={this.uploadImgInfo}
            />
          </div>}
        </div>
        <div style={{display: 'none'}}>
          <input name="uploadimage" type='file' ref="files" accept="image/png, image/jpeg" onChange={this.selectPhoto} />
        </div>
        {this.state.remindPopup && <RemindPopup
          type={this.state.popType}
          msg={this.state.popMsg}
          autoClose = {true}
          onClose={() => {this.setState({ remindPopup: false });}}
        />}
      </div>
    );
  }
}