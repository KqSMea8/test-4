import Sleep from '../libs/Sleep'
import TaskGroup from "./TaskGroup"

/**
 * TASKS：整个循环任务系统的任务列表
 *    key：String 每个任务组的唯一标识
 *    value：Object TaskGroup类
 */
const TASKS = new Map();

// loopHandler循环调度中心
const LoopHandler = {
  startFlag: false,
  set: (key, func, time) => {
    let taskGroup = TASKS.get(key) || new TaskGroup();
    taskGroup.setTask(func, time);
    TASKS.set(key, taskGroup)
  },
  
  setDelayTime: (key, value) => {
    let taskGroup = TASKS.get(key) || new TaskGroup();
    taskGroup.setDelayTime(value);
    TASKS.set(key, taskGroup)
  },
  
  start: key => {
    let taskGroup = TASKS.get(key) || new TaskGroup();
    if (!taskGroup) {
      return false
    }
    taskGroup.start();
    TASKS.set(key, taskGroup)
  },
  
  stop: key => {
    let taskGroup = TASKS.get(key) || new TaskGroup();
    if (!taskGroup) {
      return false
    }
    taskGroup.stop();
    TASKS.set(key, taskGroup)
  },
  
  clear: key => {
    TASKS.delete(key)
  },
  
  jump: (key, value) => {
    let taskGroup = TASKS.get(key);
    if (!taskGroup) {
      return false
    }
    taskGroup.stop();
    taskGroup.start(value);
    TASKS.set(key, taskGroup)
  },
  
  clearAll: () => {
    TASKS.clear()
  },
  
  // 循环任务调度函数
  taskLoop: async () => {
    if(LoopHandler.startFlag){
      return false
    }
    LoopHandler.startFlag = true;
    while (1) {
      TASKS.forEach((value) => value.runTask());
      await Sleep(8)
    }
  }
};

export default LoopHandler



