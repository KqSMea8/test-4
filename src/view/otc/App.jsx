import React, { Component } from "react";
import Otc from './component/Otc.jsx';
import otcLang from './lang/index.js'
import Translate from '@/core/libs/Translate'
import OtcController from '@/class/otc/OtcController'
import AssetController from '@/class/asset/AssetController'

let otcController,
    assetController,
    configController,
    userController,
    popupController;

class OtcCon extends Component{
  constructor(props) {
    super(props);

    otcController = new OtcController();
    assetController = new AssetController()
    configController = props.configController;
    userController = props.userController;
    popupController = props.popupController;
    assetController.userController = props.userController

    otcController.configController = configController;
    otcController.userController = userController;
    otcController.popupController = popupController;
    otcController.assetController = assetController;
  }
  render(){
    return(
        <Otc controller={otcController}/>
    )
  }
}
export default Translate(OtcCon, otcLang)