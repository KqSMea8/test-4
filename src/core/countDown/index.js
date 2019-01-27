import Loop from '../loop'
/**
   * 倒计时方法
   */
export function countDown(key, state, view) {
  Loop[key].clear();
  Loop[key].setDelayTime(1000);
  Loop[key].set(async () => {
    if (view.state[state] === 0) {
      Loop[key].stop();
      return;
    }
    let obj = {};
    obj[state] = view.state[state] - 1;
    view.setState(obj);
  }, 1000);
  Loop[key].start();
}
export function countDownStop(key) {
  Loop[key].stop();
  Loop[key].clear();
}