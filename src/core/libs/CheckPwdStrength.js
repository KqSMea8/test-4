export default {
  CheckPwdStrength(pwd) { // 登录密码长度校验
    let regPwd1 = /^(?=.*[A-Z].*)(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,32}$/,
        regPwd2 = /^(?=.*[A-Z].*)(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W_]+$)(?![a-z\d]+$)(?![a-z\W_]+$)(?![\d\W_]+$)\S{8,32}$/,
        regPwd3 = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])\S{8,32}$/;
    if(regPwd3.test(pwd)) return 3
    if(regPwd2.test(pwd)) return 2
    if(regPwd1.test(pwd)) return 1
    return 0
  },

  CheckFundPwdStrength(pwd) { // 资金密码长度校验
    let regPwd1 = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,32}$/,
        regPwd2 = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W_]+$)(?![a-z\d]+$)(?![a-z\W_]+$)(?![\d\W_]+$)\S{6,32}$/,
        regPwd3 = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])\S{6,32}$/;
    if(regPwd3.test(pwd)) return 3
    if(regPwd2.test(pwd)) return 2
    if(regPwd1.test(pwd)) return 1
    return 0
  }
}

