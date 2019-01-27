
import Util from "@/core/libs/GlobalUtil";
import PopupStore from './PopupStore'

export default class PopupController {
  constructor() {
    this.store = new PopupStore()
    this.store.setController(this);
  }

  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }
  setState(obj) {
    this.view && this.view.setState(obj)
  }
}