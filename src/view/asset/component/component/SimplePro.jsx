import React, { Component } from "react";
import intl from "react-intl-universal";
const scrollbot = require('simulate-scrollbar');

export default class SimplePro extends Component {
  constructor(props) {
    super(props);
    let { controller } = this.props;
    controller.setView(this);
    this.intl = intl;
    this.name = "simple";
    this.state = {};
    let { pairFees, wallet } = controller.initState;
    this.state = Object.assign(this.state, { pairFees, wallet });
    //绑定方法
    this.getAssets = controller.getAssets.bind(controller);
    this.sort = controller.sort.bind(controller);
    this.getPairFees = controller.getPairFees.bind(controller);
  }

  async componentDidMount() {
    this.customScroll = new scrollbot('#simplePro-asset-list');
    let obj = await this.getPairFees();
    this.setState(obj);
    await this.getAssets();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.length !== this.nextLength || this.props.show !== prevProps.show) {
      this.length = this.nextLength;
      this.customScroll && this.customScroll.refresh();
    }
  }

  render() {
    let hideLittle = this.props.hideLittle;
    let result = hideLittle
      ? this.state.wallet.filter(v => v.valuationBTC > 0.001)
      : this.state.wallet;
      this.nextLength = result.length;
    return (
      <div className="simplePro clearfix">
        <div className="thead clearfix">
          <p>{this.intl.get('asset-currency')}</p>
          <p>{this.intl.get('asset-amount')}</p>
          <p>{this.intl.get('deal-use')}</p>
          <p>{this.intl.get('asset-frozen')}</p>
          <p>{this.intl.get('asset-tobtc')}</p>
        </div>
        <div id="simplePro-asset-list" style={{width:'100%', height: '239px', overflow: 'hidden'}}>
          <div>
            <table style={{width: document.getElementById('trade_order_pro') && document.getElementById('trade_order_pro').clientWidth}}>
              <tbody>
                {result && result.length ? this.sort(result, ["valuationBTC"], 0, ["coinName"]).map(
                  (v, i) => (
                    <tr key={i}>
                      <td>{v.coinName.toUpperCase()}</td>
                      <td>
                        {Number(v.totalCount).format({
                          number: "property",
                          style: { decimalLength: 8 }
                        })}
                      </td>
                      <td>
                        {Number(v.availableCount).format({
                          number: "property",
                          style: { decimalLength: 8 }
                        })}
                      </td>
                      <td>
                        {Number(v.frozenCount).format({
                          number: "property",
                          style: { decimalLength: 8 }
                        })}
                      </td>
                      <td>
                        {Number(v.valuationBTC).format({
                          number: "property",
                          style: { decimalLength: 8 }
                        })}
                      </td>
                    </tr>
                  )
                ) : (
                  <tr className="empty">
                    <td colSpan="5">
                      <p>{this.intl.get('noRecords')}</p>
                    </td>
                  </tr>)
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
