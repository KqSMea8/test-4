import JsonBig from 'json-bigint'
import {BigNumber} from "bignumber.js";

JSON.stringify = (... parmas) => JsonBig.stringify(... parmas)


JSON.parse = (... parmas) => JsonBig.parse(... parmas)


const NUMBER_SUFFIX_ARR = []; // 数字后缀格式{value:10000,suffix:'万'},{value:100000000,suffix:'亿'}
const NUMBER_PREFIX_ARR = {
  cny: {
    up: {prefix: '¥ '},
    stable: {prefix: '¥ '},
    down: {prefix: '¥ '},
    // decimalLength: 2
  },
  usd: {
    up: {prefix: '$ '},
    stable: {prefix: '$ '},
    down: {prefix: '$ '},
    // decimalLength: 2
  },
  usdt: {
    up: {prefix: '$ '},
    stable: {prefix: '$ '},
    down: {prefix: '$ '},
    // decimalLength: 2
  }
}

const NUMBER_GENERAL_VALUE = [1000, 1, 0.1, 0.01]; //数字分类
const GENERAL_DECIMAL_LENGTH = [];//小数部分最小长度
const NUMBER_GENERAL_FUNC = [];// 对不同大小数字操作的函数数组
NUMBER_GENERAL_FUNC.push(number => parseInt(number.toFixed()));
NUMBER_GENERAL_FUNC.push(number => parseFloat(number.toFixed(2)));
NUMBER_GENERAL_FUNC.push(number => parseFloat(number.toFixed(4)));
NUMBER_GENERAL_FUNC.push(number => parseFloat(number.toFixed(6)));
NUMBER_GENERAL_FUNC.push(number => parseFloat(number.toFixed(8)));
const NUMBER_DIGITAL_VALUE = [100, 0.1, 0.01]; //数字分类
const DIGITAL_DECIMAL_LENGTH = [2, 4, 6, 8];//小数部分最小长度
const NUMBER_DIGITAL_FUNC = [];// 对不同大小数字操作的函数数组
NUMBER_DIGITAL_FUNC.push(number => parseFloat(number.toFixedWithoutUp(2)));
NUMBER_DIGITAL_FUNC.push(number => parseFloat(number.toFixedWithoutUp(4)));
NUMBER_DIGITAL_FUNC.push(number => parseFloat(number.toFixedWithoutUp(6)));
NUMBER_DIGITAL_FUNC.push(number => parseFloat(number.toFixedWithoutUp(8)));

const NUMBER_PROPERTY_VALUE = []; //数字分类
const PROPERTY_DECIMAL_LENGTH = [8];//小数部分最小长度
const NUMBER_PROPERTY_FUNC = [];// 对不同大小数字操作的函数数组
NUMBER_PROPERTY_FUNC.push(number => parseFloat(number.toFixedWithoutUp(8)));

const NUMBER_LEGAL_VALUE = []; //数字分类
const LEGAL_DECIMAL_LENGTH = [2];//小数部分最小长度
const NUMBER_LEGAL_FUNC = [];// 对不同大小数字操作的函数数组
NUMBER_LEGAL_FUNC.push(number => parseFloat(number.toFixedWithoutUp(2)));

let config = {
  format: {
    numberFormat: {
      general: {
        numberValue: NUMBER_GENERAL_VALUE,
        numberFunc: NUMBER_GENERAL_FUNC,
        decimalLength: GENERAL_DECIMAL_LENGTH
      },
      digital: {
        numberValue: NUMBER_DIGITAL_VALUE,
        numberFunc: NUMBER_DIGITAL_FUNC,
        decimalLength: DIGITAL_DECIMAL_LENGTH
      },
      property: {
        numberValue: NUMBER_PROPERTY_VALUE,
        numberFunc: NUMBER_PROPERTY_FUNC,
        decimalLength: PROPERTY_DECIMAL_LENGTH
      },
      legal: {
        numberValue: NUMBER_LEGAL_VALUE,
        numberFunc: NUMBER_LEGAL_FUNC,
        decimalLength: LEGAL_DECIMAL_LENGTH
      }
    },
    numberSuffixArr: NUMBER_SUFFIX_ARR,
    numberPrefixArr: NUMBER_PREFIX_ARR,
  },
}
Number.prototype.fixedHandle = function (length, up = true, separator = true) {
  let min = this < 0 ? '-' : '';
  let number = (this < 0.000001 && this !== 0) ? `${min}${Math.abs(this).toFixed(9)}` : String(this);
  let numberArr = number.split('.');
  if(numberArr.length === 1){
    return number
  }
  if (length >= numberArr[1].length){
    if (separator){
      let numberAfter = numberArr.length === 1 ? '' : numberArr[1];
      return `${numberArr[0].separator()}.${numberAfter}`
    }
    return number;
  }
  let judgeNumber, commonLength, commonNumber, preNumber, plusFlag;
  judgeNumber = numberArr[1][length] - 0;
  commonNumber = numberArr[1].substr(0, length);
  commonLength = commonNumber.length;
  preNumber = numberArr[0];
  plusFlag = false
  ;
  if (up && judgeNumber >= 5) {
    commonNumber = Number(commonNumber) + 1;
    if(String(commonNumber).length > commonLength){
      plusFlag = true;
      preNumber = String(Number(preNumber) + (this > 0 ? 1 : -1))
    }
  }
  if (separator){
    preNumber = preNumber.separator()
  }
  return plusFlag ? preNumber : `${preNumber}.${commonNumber}`
}

//末尾省去函数，传入长度，不穿参数默认省略小数点后
Number.prototype.toFixedWithoutUp = function (length) {
  length = length || 0
  let numberCache = this.toFixed(length + 1)
  return Number(numberCache.substring(0, numberCache.toString().length - 1))
}

Number.prototype.maxHandle = function (length) {
  let numberCache = this >= 0 && this.toString().split('.');
  let numberResult = numberCache.length > 1 ? `${numberCache[0]}.${numberCache[1].substr(0, length)}` : numberCache[0];
  return Number(numberResult)
}

Number.prototype.toFixedUp = function (length = 0) {
  return (Math.round(this * Math.pow(10, length)) / Math.pow(10, length) + Math.pow(10, -(length + 1))).toFixed(length)
};

Number.prototype.formatTurnover = function () {
  let turnover = this >= 1000 ? (this.toFixedUp(2)) : (this >= 1 ? this.toFixedUp(4) : this.toFixedUp(8));
  return Number(turnover).format({style: {thousandSign: false}})
}
//添加前缀后缀函数，分隔符，补零函数
Number.prototype.formatFixStyle = function (para) {
  // if(Math.abs(this) === 0)
  //   return ''+this
  let number = Math.abs(this),
      negative = this < 0 ? "-" : "",
      numberPrefixArr = config.format.numberPrefixArr,
      numberValue = config.format.numberValue,
      numberSuffixArr = config.format.numberSuffixArr,
      prefix = para && (para.prefix || para.name && (numberPrefixArr[para.name] && numberPrefixArr[para.name][para.type || 'stable'].prefix)) || '',
      suffix = para && (para.suffix || para.name && (numberPrefixArr[para.name] && numberPrefixArr[para.name][para.type || 'stable'].suffix)) || '',
      decimalLength = para.decimalLength || -1,
      decimalSign = para.decimalSign || '.',
      thousandSign = typeof para.thousandSign !== 'boolean' && (para.thousandSign || ',') || '',
      numberArr = (number < 0.000001 && number !== 0) ? (number.toFixed(9).split('.')) : number.toString().split('.'),
      numberSuffix = "", decimal = (number < 0.000001 && number !== 0) ? (numberArr[1].replace(/0$/, '')) : (numberArr[1] || ''),
      i = numberArr[0],
      j = i.length > 3 ? i.length % 3 : 0;
  decimal.length < decimalLength && new Array(decimalLength - decimal.length).fill(0).forEach(v => decimal += v)
  if (decimal.length > decimalLength && decimalLength !== -1) {
    // console.warn(decimal, Number(decimal), Number(decimal) / Math.pow(10,decimal.length - decimalLength), (Number(decimal) / Math.pow(10,decimal.length - decimalLength)).toFixedUp(decimalLength))
    // decimal = (Number(decimal) / Math.pow(10,decimal.length - decimalLength)).toFixedUp()
    let result;
    // if(decimal[decimalLength] >= 5) result = decimal.slice(0,decimalLength - 1) + (Number(decimal[decimalLength - 1]) + 1);
    // if(decimal[decimalLength] < 5) result = decimal.slice(0,decimalLength);
    result = decimal.slice(0, decimalLength)
    decimal = result
  }
  numberSuffixArr.forEach(v => number >= v.value && (numberSuffix = v.suffix));
  suffix += numberSuffix;
  return prefix + negative + (j ? i.substr(0, j) + thousandSign : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandSign) + (decimal.length > 0 ? decimalSign + decimal : '') + suffix;
}

//专业补零函数
String.prototype.addZero = function (length) {
  let numberArr = this.split('.'), decimal = numberArr[1] || ''
  return decimal.length < length && !(new Array(length - decimal.length).fill(0).forEach(v => decimal += v)) && numberArr[0] + '.' + decimal || this
}

//三位分隔符
String.prototype.separator = function () {
  let i = this,
      j = i.length > 3 ? i.length % 3 : 0;
  return (j ? i.substr(0, j) + ',' : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ',')
};

//此函数不会受到精度影响
function findFlag(number, formatType) {
  let numberValue = config.format.numberFormat[formatType].numberValue,
      flag = numberValue.length;
  for (let i = 0; i < numberValue.length; i++) {
    if (number >= numberValue[i]) {
      flag = i;
      break;
    }
  }
  return flag
}

//精度格式化
// TODO: 目前仅支持传入类型修改精度，有待扩展
// TODO: 无法根据其他值修改精度要求，必须扩展
Number.prototype.formatFixNumber = function (formatType) {
  if (Math.abs(this) === 0)
    return this
  formatType = formatType || 'general'
  let type = this > 0 ? 1 : -1,
      number = Math.abs(this),
      numberFunc = config.format.numberFormat[formatType].numberFunc
  if (numberFunc.length === 0)
    return type * number
  let flag = findFlag(number, formatType)
  return type * numberFunc[flag](number);
};

Number.prototype.formatFixNumberForAmount = function (accuracy, test = true) {
  if (test)
    return this
  return ('' + this.toFixedWithoutUp(accuracy).formatFixStyle({})).addZero(accuracy)
}

//数字format
//number根据什么类型格式化number
//format({number:'legal',style:{name:'cny', decimalLength: 4}, unZeroize: true, fixed: true,separator: true})
//style根据什么类型加前缀和后缀
//unZeroize 是否补零， 默认为false， 补零，传true为不补
//fixed 四舍五入 还是直接截取 默认为true 即四舍五入
//separator 是否有分隔符 默认为true 即有
// TODO: 因现在没有添加后缀的需求，所以可以直接根据类型补零，必须修改
Number.prototype.format = function (para) {
  let style = para && para.style || {},
      unZeroize = para ? para.unZeroize : false,
      length = style ? style.decimalLength : 2,
      fixed = para ? para.fixed : true,
      prefix = style ? style.name : false,
      separator = para ? para.separator : true;
  let value = this.fixedHandle(length, fixed, separator);
      if(!unZeroize){
        value = value.addZero(length)
      }
      if(prefix){
        value = `${NUMBER_PREFIX_ARR[style.name][style.type || 'stable'].prefix}${value}`
      }
  return value
}

//百分比
Number.prototype.toPercent = function (type = true) {
  if (type && (this * 100) === 0)
    return `${(this * 100).toFixedUp(2)}%`
  if (type && (this * 100) > 0)
    return `+${(this * 100).toFixedUp(2)}%`
  return `${(this * 100).toFixedUp(2)}%`
}

//时间戳转换
Number.prototype.toDate = function (fmt) {
  let date = new Date(this * 1000);
  return date.dateHandle(fmt)
};

// xxxx-yy-zz, hh:mm:ss
/**
 * @returns {string}
 */
Date.prototype.dateHandle = function (fmt) {
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  let obj =
      {
        'y': this.getFullYear(), // 年份，注意必须用getFullYear
        'M': this.getMonth() + 1, // 月份，注意是从0-11
        'd': this.getDate(), // 日期
        'w': this.getDay(),
        'H': this.getHours(), // 24小时制
        'h': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 12小时制
        'm': this.getMinutes(), // 分钟
        's': this.getSeconds(), // 秒
        'S': this.getMilliseconds() // 毫秒
      };
  let week = ['日', '一', '二', '三', '四', '五', '六'];
  for (let i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (wfy) {
      let val = obj[i] + '';
      if (i === 'w') return (wfy.length > 2 ? '星期' : '周') + week[val];
      for (let j = 0, len = val.length; j < wfy.length - len; j++) val = '0' + val;
      return wfy.length === 1 ? val : val.substring(val.length - wfy.length);
    });
  }
  return fmt;
};

//  js Number加减乘除 计算 (依赖bignumber.js) 为了保留精度
//加
Number.prototype.plus = function (num) {
  return (new BigNumber(this)).plus(num)
}
// 减
Number.prototype.minus = function (num) {
  return (new BigNumber(this)).minus(num);
};
// 乘
Number.prototype.multi = function (num) {
  return (new BigNumber(this)).multipliedBy(num);
};
// 除
Number.prototype.div = function (num) {
  return (new BigNumber(this)).dividedBy(num);
};
// 添加正号
Number.prototype.addPlus = function () {
  let value = this > 0 ? `+${this}` : this;
  return value
}