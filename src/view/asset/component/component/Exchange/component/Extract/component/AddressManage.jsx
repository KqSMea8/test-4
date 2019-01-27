import React, {Component} from "react";
import intl from "react-intl-universal";
import Button from "@/common/baseComponent/Button";
import Input from "@/common/baseComponent/Input";
import BasePopup from "@/common/baseComponent/Popup";
import {ASSET_CLOSED} from "@/config/ImageConfig";

export default class Popup extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      showInput: false,
      deleTip: false,
      deleText: this.intl.get('asset-delet-confirm'),
      deleItem: ''
    };
    this.setAddress = props.changeNewAddress;
    this.add = async () => {
      let flag;
      this.props.onSave && (flag = await this.props.onSave());
      if (flag) {
        this.setAddress([]);
      }
    }
  }

  componentWillUnmount() {
    this.setAddress([])
  }

  render() {
    let {onClose, addressArr, onDelete} = this.props;
    let newAddress = JSON.parse(JSON.stringify(this.props.newAddress));
    this.popup = () => {
      return (
        <div className="asset-popup-content base3">
          <img
            className="close"
            src={ASSET_CLOSED}
            alt=""
            onClick={() => {
              onClose && onClose();
            }}
          />
          <h3>
            {this.intl.get('asset-addAddress')}<span
            onClick={() => {
              if (newAddress.length) {
                this.props.addTip();
                return;
              }
              newAddress.push({addressName: "", address: ""});
              this.setState({
                showInput: true,
              });
              this.setAddress(newAddress);
            }}
          >
                {this.intl.get('add')}
              </span>
          </h3>
          <table className="list">
            <thead>
            <tr>
              <th className="name">{this.intl.get('name')}</th>
              <th className="base3-address">{this.intl.get('address')}</th>
              <th>{this.intl.get('action')}</th>
            </tr>
            </thead>
            <tbody>
            {this.state.showInput &&
            newAddress.map((item, index) => {
              return (
                <tr className="input" key={index}>
                  <td>
                    <Input
                      type="text"
                      value={item.name}
                      placeholder={this.intl.get('asset-inputName')}
                      onInput={value => {
                        item.addressName = value;
                        this.setAddress(newAddress);
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      value={item.address}
                      placeholder={this.intl.get('asset-inputAddress')}
                      onInput={value => {
                        {/* value = value.replace(/[\u4e00-\u9fa5]/g, ""); */
                        }
                        item.address = value;
                        this.setAddress(newAddress);
                      }}
                    />
                    <div className="button">
                      <Button
                        type="base"
                        title={this.intl.get('save')}
                        onClick={() => {
                          this.add(item, index)
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <Button
                      title={this.intl.get('cance')}
                      onClick={() => {
                        this.setAddress([]);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            {addressArr &&
            addressArr.map((item, index) => <tr className={`base3-content ${index === 0 ? 'first' : ''}`} key={index}>
                <td><p>{item.addressName}</p></td>
                <td><p>{item.address}</p></td>
                <td>
                  <Button
                    title={this.intl.get('delete')}
                    theme="danger"
                    onClick={() => {
                      this.setState({deleTip: true, deleItem: item})
                    }}
                  />
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      );
    };
    return <div className="asset-popup">
      {this.popup()}
      {/*确认弹窗  */}
      {this.state.deleTip && (
        <BasePopup
          type="confirm"
          msg={this.state.deleText}
          onClose={() => {
            this.setState({deleTip: false});
          }}
          onConfirm={async () => {
            onDelete && await onDelete(this.state.deleItem);
            this.setState({deleTip: false});
          }}
          onCancel={() => {
            this.setState({deleTip: false});
          }}
        />
      )}
    </div>;
  }
}
