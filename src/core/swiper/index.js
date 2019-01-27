import Loop from '../loop';
import Sleep from '../libs/Sleep'
export function swiper(key, view, state, stateCache, criticalArr, speed, displayTime, func) {
  Loop[key].clear();
  Loop[key].setDelayTime(displayTime);
  Loop[key].set(async () => {
    let obj = {};
    obj[state] = view.state[state] - speed;
    obj[stateCache] = view.state[stateCache] - speed;
    await view.setState(obj);
    if (view.state[state] === criticalArr[0]) {
      view.state[stateCache] = criticalArr[criticalArr.length - 1];
    }
    if (view.state[stateCache] === criticalArr[0]) {
      view.state[state] = criticalArr[criticalArr.length - 1];
    }
    if (
      criticalArr.includes(view.state[state]) ||
      criticalArr.includes(view.state[stateCache])
    ) {
      Loop[key].stop();
      func && func(view.state[state], view.state[stateCache])
      await Sleep(displayTime);
      Loop[key].start();
    }
  }, 80);
  Loop[key].start();
}

export function swiperClear(key) {
  Loop[key].clear();
}

export function swiperStop(key) {
  Loop[key].stop();
}