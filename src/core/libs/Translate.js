import React, { Component } from "react";
import intl from "react-intl-universal";
import en from "../../lang/en.js";
import zh from "../../lang/zh.js";
import Storage from "../storage/index"

export default (WrappedComponent, fn) => {
  class TranslateComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fn: fn ? null : 1
      };
      if(!fn) this.loadLocales()
    }

    async componentDidMount() {
      if(!fn) return;
      // const { default: fn } = await Pmodule();
      this.loadLocales(fn);
      this.setState({fn});
    }

    loadLocales = (fn)=>{
      const locales = {
        "en-US": en(fn && fn.en || {}),
        "zh-CN": zh(fn && fn.zh || {})
      };
      let lang = Storage.language.get() || "zh-CN";
      intl.init({
        currentLocale: lang, // TODO: determine locale here
        locales,
      });
    }

    render() {
      return this.state.fn ? <WrappedComponent {...this.props}/> : null
    }
  }
    return TranslateComponent
}