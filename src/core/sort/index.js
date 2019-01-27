import Util from "../libs/GlobalUtil";
 /**
   * 排序
   * arr: 需排序数组
   * sortValue：排序属性，即依托什么排序
   * sortDefault: 排序两者相等时的排序属性
   * type: 0 //降序 ， 1 //升序
   * return 排序后的数组
   */
  export default function sort(arr, sortValue, type, sortDefault) {
    if (!sortValue.length) return arr;
    return Util.deepCopy(arr).sort((a, b) => {
      let first = a,
        second = b;
      sortValue.forEach(v => {
        first = first[v];
        second = second[v];
      });
      if (first === second && sortDefault) {
        first = a;
        second = b;
        sortDefault.forEach(v => {
          first = first[v];
          second = second[v];
        });
      }
      (first instanceof Object) && !(first instanceof Array) && (first = Number(first));
      (second instanceof Object) && !(second instanceof Array) && (second = Number(second));
      if (type) {
        if (first > second) return 1;
        if (first <= second) return -1;
      }
      if (!type) {
        if (first >= second) return -1;
        if (first < second) return 1;
      }
    });
  }