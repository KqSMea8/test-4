;
import Util from "@/core/libs/GlobalUtil";
import KdepthStore from "./KdepthStore";

export default class KdepthController {
  constructor() {
    this.store = new KdepthStore();
  }
  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }
  // set深度数据
  setData(data) {
    // console.log('set深度数据.............', data)
    let result = {};
    if (!data) {
      result = { bids: [], asks: [] };
    }
    // console.log('深度数据', data)
    // if(!data.buy || !data.sell || data.buy.length<2 || data.sell.length<2)
    result.bids = data && data.buy ? data.buy.map(v => {
          let arr = [];
          arr.push(v.price);
          arr.push(v.amount);
          return arr;
        }) : [];
    result.asks = data && data.sell ? data.sell.map(v => {
            let arr = [];
            arr.push(v.price);
            arr.push(v.amount);
            return arr;
          }) : [];
    this.view && this.view.setData(result);
  }
  get language() {
    return this.configController.initState.language.toLowerCase();
  }
}
