/*
* 防止快速点击事件
*
* 每个方法有自己独特的标志
*
* */
let storeDb = new Map();
export function deleteDbPro (k) {
  storeDb.delete(k)
}
export function getDbPro (k) {
  if(!storeDb.get(k)){
    storeDb.set(k, true);
    return false
  }
  return storeDb.get(k)
}