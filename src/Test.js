/**
 * 使用方法
 *  1.在ProxyConfig配置好相关参数
 *  2.import Storage文件Storage.()执行
 *   @params name  对应ProxyConfig配置内的name  相当于索引  必传
 *   @params action (add, del, get, handler,) 方法 必传
 *   @params ...para  其他参数选传
 *  3.set：存Storage
 *    add：添加一项
 *    del：删除一项，或者根据某一条件删除部分
 *    get：取Storage
 *    handler：最后一个参数为true，则调add，第二个参数为false则调del
 *    removeAll：删除所有
 *     【具体操作查看libs/Storage.js】
 */

import StorageApi from '@/core/libs/Storage' //引入storage
import StoreConfig from '@/config/StorageConfig'
/**
 * 添加localStorage
 * @param key 键
 * @param value 值
 * @param index 添加的位置(第几个后) 【选参，不传则默认添加入头部】
 * @param duration 持续时间（ms）【选参，不传则持续时间无限制】
 *  注：暂时只支持数组增加
 *      对于属性嵌套数组，key为数组 [key, 嵌套属性1, ...]
 */
const addStorage = (key, value, index = 0, arrpath = [], duration = 0) => {
  if (!value || !key) return false;
  let dataAll = StorageApi.getStorageAll(key), data = dataAll.value, tmpData = data, expiryTime = dataAll.expiryTime;
  arrPath instanceof Array && arrPath.length > 0 && arrPath.forEach(v => tmpData = tmpData[v]);
  tmpData instanceof Array && tmpData.splice(index, 0, value);
  duration && (expiryTime = 0);
  StorageApi.setStorage(key, data, duration, expiryTime);
  return true
};
/**
 * 删除存入localStorage中的某一个
 * @param key 键
 * @param value 删除的元素
 * @param duration 持续时间（ms）【选参，不传则持续时间跟上个一样，传true则取消时间限制】
 *  注：暂时只支持数组增加
 *      对于属性嵌套数组，key为数组 [key, 嵌套属性1, ...]
 *      当删除的为对象时，value为对象，标识筛选条件
 */
const delStorage = (key, value, arrPath = [], duration = 0) => {
  if (!value || !key) return false;
  let dataAll = StorageApi.getStorageAll(key), data = dataAll.value, tmpData = data, expiryTime = dataAll.expiryTime,
      valueTmp = [value];
  arrPath instanceof Array && arrPath.length > 0 && arrPath.forEach(v => tmpData = tmpData[v]);
  tmpData instanceof Array && value instanceof Object && tmpData.forEach(v => {
    let valueFlag = 0;
    Object.keys(value).forEach(vv => v[vv] === value[vv] && valueFlag++);
    valueFlag >= Object.keys(value).length && valueTmp.push(v)
  });
  tmpData instanceof Array && valueTmp.forEach(v => tmpData.indexOf(v) >= 0 && tmpData.splice(0, tmpData.length, ...tmpData.filter(vv => vv !== v)));
  duration && (expiryTime = 0);
  StorageApi.setStorage(key, data, duration, expiryTime);
  return true
};

const addCookie = (key, value, index = 0, arrPath = []) => {
  if (!value || !key) return false;
  let dataAll = StorageApi.getCookieAll(key), data = dataAll.value, tmpData = dataAll.value, domain = dataAll.domain, path = dataAll.path, time = dataAll.time;
  arrPath instanceof Array && arrPath.length > 0 && arrPath.forEach(v => tmpData = tmpData[v]);
  tmpData instanceof Array && tmpData.splice(index, 0, value);
  StorageApi.setCookie(key, data, domain, path, time);
  return true
};

const delCookie = (key, value, arrPath = []) => {
  if (!value || !key) return false;
  let dataAll = StorageApi.getCookieAll(key), data = dataAll.value, tmpData = dataAll.value, domain = dataAll.domain, path = dataAll.path, time = dataAll.time,
      valueTmp = [value];
  arrPath instanceof Array && arrPath.length > 0 && arrPath.forEach(v => tmpData = tmpData[v]);
  tmpData instanceof Array && value instanceof Object && tmpData.forEach(v => {
    let valueFlag = 0;
    Object.keys(value).forEach(vv => v[vv] === value[vv] && valueFlag++);
    valueFlag >= Object.keys(value).length && valueTmp.push(v)
  });
  tmpData instanceof Array && valueTmp.forEach(v => tmpData.indexOf(v) >= 0 && tmpData.splice(0, tmpData.length, ...tmpData.filter(vv => vv !== v)));
  StorageApi.setCookie(key, data, domain, path, time);
  return true
};

const StoreAction = {
  session: {
    set: (name, obj, value) => StorageApi.setSession(name, value),
    get: (name) => StorageApi.getSession(name),
    remove: (name) => StorageApi.removeSession(name)
  },
  cookie: {
    set: (name, obj, value, domain =process.env.DOMAIN, path = '/', time = false) => StorageApi.setCookie(name, value, domain, path, time),
    get: (name) => StorageApi.getCookie(name),
    removeAll: (name,obj, domain =process.env.DOMAIN) => StorageApi.removeCookie(name, domain),
    add: (name, obj, value, index, arrpath = obj.arrPath) => addCookie(name, value, index, arrpath),
    del: (name, obj, value, arrpath = obj.arrPath) => delCookie(name, value, arrpath),
    handle: (name, ...params) => {
      params.pop() ? addCookie(name, ...params) : delCookie(name, ...params)
    }
  },
  storage: {
    set: (name, obj, value, duration = obj.duration, expiryTime = obj.expiryTime) => StorageApi.setStorage(name, value, duration, expiryTime),
    get: (name) => StorageApi.getStorage(name),
    removeAll: (name) => StorageApi.removeStorage(name),
    add: (name, obj, value, index, arrpath = obj.arrPath, duration) => addStorage(name, value, index, arrpath, duration),
    del: (name, obj, value, arrPath = obj.arrPath, duration = obj.duration) => delStorage(name, value, arrPath, duration),
    handle: (name, ...params) => {
      params.pop() ? addStorage(name, ...params) : delStorage(name, ...params)
    }
  }
};
export default function StoreHandle(name, action, ...para) {
  const PREOBJ = StoreConfig.storageList;
  //     {
  //   'gt': {
  //     //ACTIONOBJ
  //     duration: 0,
  //     expiryTime: 0,
  //     default: null,
  //     useDefault: true,
  //     type: 'session'
  //   }
  // };
  const ACTIONOBJ = PREOBJ[name];
  StoreAction[ACTIONOBJ.type][action](name, ACTIONOBJ, ...para,)
}
