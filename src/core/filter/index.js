const FILTERFUNC = {
  function: (arr, func) => arr.filter(func),
  number: (arr, num) => arr.filter(v => v === num),
  undefined: arr => arr,
  string: (arr, str) =>
    arr.filter(v => typeof v === "string" && v.indexOf(str) > -1),
  object: (arr, obj) =>
    arr.filter(v => typeof v === "object" &&
        Object.keys(obj).filter(vv => v[vv] !== "undefined" && FILTERFUNC[typeof obj[vv]]([v[vv]], obj[vv]).length).length === Object.keys(obj).length
    ),
  boolean: (arr, bool) => (bool && arr.filter(v => v)) || arr.filter(v => !v)
};

/**
   * 从某一数组中按某一规则进行筛选
   * arr: 搜索原数组 type Array
   * rule：规则(不传或传入其他参数则返回原数组)
   *  type Function function 直接按照传入的function筛选
   *  type String string 在数组中筛选出包含rule字符串的元素
   *  type Object object 根据rule对象内部的(key, value)进行筛选，在数组中筛选出包含所有rule对象key且属性包含rule对象value的元素
   *  type Bool boolean 筛选出数组中为true或者false的元素
   *  type Number number 筛选出数组中与rule数字相等的元素
   * return 筛选后的数组
   */
  export default function filter(arr, rule) {
    return (
      (FILTERFUNC[typeof rule] && FILTERFUNC[typeof rule](arr, rule)) || arr
    );
  }