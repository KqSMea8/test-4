function Regular(regTitle, regCon, tradeData) {
  let regularObj = {
    regIp: /^(?:(?:25[0-5]|2[0-4]\d|(?!0)[01]?\d\d?|0)\.){3}(?:25[0-5]|2[0-4]\d|(?!0)[01]?\d\d?|0)$/, // ip地址
    regEmail: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, // email
    regPhone: /^1[3456789]\d{9}$/, // phone
    regPwd: /^(?=.*[A-Z].*)(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,32}$/, // 密码
    // regFundPwd: /^\d{6}$/, // 资金密码
    // regFundPwd:  /^\d{6,32}|[a-z]{6,32}|[A-Z]{6,32}|[\W_]{6,32}$/, // 资金密码
    regFundPwd: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,32}$/, // 资金密码
    regTrade: new RegExp(`^[0-9]{0,${tradeData}}$`), // 交易价格、数量
    regId: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, // 身份证
    regPassPort1: /^[a-zA-Z]{5,17}$/, // 护照
    regPassPort2: /^[a-zA-Z0-9]{5,17}$/, // 护照
    regName: /^[a-zA-Z\u4e00-\u9fa5]+$/, // 名字
    regDigital: /^[0-9]+\.?[0-9]{0,8}$/, // 数字资产（8位非负数）
    regLegal: /^[0-9]+\.?[0-9]{0,2}$/, // 法币资产（2位非负数）
    regNumber: /^(-?\d+)(\.\d+)?$/, //浮点数正则
    regNumber2: /^(-?\d+)(\.\d{0,2})?$/, //浮点数正则
    regBank:/^([1-9]{1})(\d{14,18})$/, //银行卡
  }
  return regularObj[regTitle].test(regCon)
}

export default Regular

