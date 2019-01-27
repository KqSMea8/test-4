import React from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Title from "../../../../common/OtcOrderTitle";
import PayWay from "@/common/component/PayWay/";
import Server from "@/config/ServerConfig"
import PropTypes from "prop-types";

export default class Collection extends ExchangeViewBase {
  static defaultProps = {
    collectionArr:[
      {type: 4, name: '迪力木拉提', bank: '中国招商银行', number: '1234 5678 9012 3456 789', qrCode: ''},
      {type: 1, name: '迪力木拉提', bank: '', number: '13611365678', qrCode: 'dsf'},
      {type: 2, name: '迪力木拉提', bank: '', number: '13611365678', qrCode: 'df'}
    ]
  }
  static propTypes = {
    collectionArr: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      showQrcode: [false, false, false, false]
    };
  }

  componentDidMount() {}

  render() {
    let { showQrcode } = this.state;
    return (
      <div className="otc-order-collection">
        <Title content={this.intl.get('order-seller-collectWays')} />
        <div className="otc-order-collection-content">
          <ul className="main">
            {this.props.collectionArr.map((v, i) => (
              <li key={i} className="item clearfix">
                <PayWay payWayStatus={v.type} className="pay-img" />
                <span>{v.name}</span>
                {(v.bank && <p>{v.bank}</p>) || ""}
                <p>
                  {v.number}
                  {(v.qr_code && (
                    <b className={!showQrcode[i] ? "none" : ""}>
                      <span
                        onClick={() => {
                          showQrcode = showQrcode.map((item,index)=>{
                            if(i === index) return !item;
                            return false;
                          })
                          this.setState({ showQrcode });
                        }}
                      >
                        {this.intl.get('order-qrcode')}
                        <i className={showQrcode[i] ? "active" : ""}/>
                      </span>
                      <img
                        src={`${Server.hSecure && 'https' || 'http'}://${Server.host}/v1/usimage/thumb/${v.qr_code}`}
                        alt=""
                      />
                    </b>
                  )) ||
                    ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
