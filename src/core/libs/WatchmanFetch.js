export default async function watchman (key) {
  return new Promise(function (resolve, reject) {
    // window.wm && window.wm.start();
    window.wm && window.wm.getToken(key, function(token) {
      // window.wm && window.wm.stop();
      resolve(token);
    });
  });
}