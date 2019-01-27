//生成带前缀的路由
const reslovePathFunc = (basePath, url, params) => {
  if(!params) {
    return `${basePath}${url || ''}`
  }
  return formatQueryToPath(`${basePath}${url || ''}`, params)
}

//生成路由
export const formatQueryToPath = (url, params) => {
  if(!params) {
    return url
  }
  let paramsKey = Object.keys(params);
  if(paramsKey.length === 0) {
    return url
  }
  return paramsKey.reduce((a, b, index)=>params[b] && (`${a}${(index === 0 && '/?') || ''}${b}=${params[b]}${((index !== paramsKey.length - 1) && '&') || ''}`) || a,`${url || ''}`)
}

// 获取url中的query
export const getQueryFromPath = name => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1]);
}

// html5 的History 改变url不刷新页面
export const changeUrlFromPath = (key, value) => {
  let state = {
    title: "",
    url: window.location.origin + window.location.pathname
  };
  history.replaceState(state, "", `${window.location.origin + window.location.pathname}?${key}=${value}`);
}

//生成路由
export const resolveActivityPath = (url, params) => reslovePathFunc(process.env.ACTIVITY_PATH, url, params);
export const resolveAssetPath = (url, params) => reslovePathFunc(process.env.ASSET_PATH, url, params);
export const resolveFundPath = (url, params) => reslovePathFunc(process.env.FUND_PATH, url, params);
export const resolveHelpPath = (url, params) => reslovePathFunc(process.env.HELP_PATH, url, params);
export const resolveHomePath = (url, params) => reslovePathFunc(process.env.HOME_PATH, url, params);
export const resolveLoginPath = (url, params) => reslovePathFunc(process.env.LOGIN_PATH, url, params);
export const resolveMessagePath = (url, params) => reslovePathFunc(process.env.MESSAGE_PATH, url, params);
export const resolveNotificationPath = (url, params) => reslovePathFunc(process.env.NOTIFICATION_PATH, url, params);
export const resolveOrderPath = (url, params) => reslovePathFunc(process.env.ORDER_PATH, url, params);
export const resolveOtcPath = (url, params) => reslovePathFunc(process.env.OTC_PATH, url, params);
export const resolvePassportPath = (url, params) => reslovePathFunc(process.env.PASSPORT_PATH, url, params);
export const resolveRegisterPath = (url, params) => reslovePathFunc(process.env.REGISTER_PATH, url, params);
export const resolveStaticPath = (url) => reslovePathFunc(process.env.STATIC_PATH, url);
export const resolveTradePath = (url, params) => reslovePathFunc(process.env.TRADE_PATH, url, params);
export const resolveUserPath = (url, params) => reslovePathFunc(process.env.USER_PATH, url, params);

//跳转路由
export const goActivityPath = (url, params) => location.href = resolveActivityPath(url, params);
export const goAssetPath = (url, params) => location.href = resolveAssetPath(url, params);
export const goFundPath = (url, params) => location.href = resolveFundPath(url, params);
export const goHelpPath = (url, params) => location.href = resolveHelpPath(url, params);
export const goHomePath = (url, params) => location.href = resolveHomePath(url, params);
export const goLoginPath = (url, params) => location.href = resolveLoginPath(url, params);
export const goMessagePath = (url, params) => location.href = resolveMessagePath(url, params);
export const goNotificationPath = (url, params) => location.href = resolveNotificationPath(url, params);
export const goOrderPath = (url, params) => location.href = resolveOrderPath(url, params);
export const goOtcPath = (url, params) => location.href = resolveOtcPath(url, params);
export const goPassportPath = (url, params) => location.href = resolvePassportPath(url, params);
export const goRegisterPath = (url, params) => location.href = resolveRegisterPath(url, params);
export const goTradePath = (url, params) => location.href = resolveTradePath(url, params);
export const goUserPath = (url, params) => location.href = resolveUserPath(url, params);


