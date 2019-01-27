// 任务组以及相关属性
import Sleep from "../libs/Sleep";
import Task from "./Task";

export default class TaskGroup {
  constructor() {
    this.delayTime = 0; //Number 第一次任务延迟多少时间
    this.task = []; //Array[Task] Task类
    this.step = -1; // Number 该任务组执行到第几步
    this.startFlag = false // Boolean 该任务组是否执行
  }
  
  //设置循环任务
  setTask = (func, time) => {
    let task = new Task(func, time, this.task.length);
    this.task.push(task)
  };
  
  //设置延迟时间
  setDelayTime = value => {
    this.delayTime = value
  };
  
  //启动任务组
  start = async (value = 0) => {
    await Sleep(this.delayTime);
    if (this.step >= 0)
      return;
    this.startFlag = true;
    this.step = value
  };
  
  //暂停任务组
  stop = () => {
    this.startFlag = false;
    this.step = -1
  };
  
  //清除任务组
  clear = () => {
    this.startFlag = false;
    this.delayTime = 0;
    this.task = [];
    this.step = -1
  };
  
  //执行任务
  runTask = () => {
    if(!this.startFlag)
      return;
    if (this.step >= this.task.length)
      this.step = 0;
    let taskStatus = this.task[this.step].runTask();
    if(taskStatus === 0){
      this.step++
    }
    
  }
  
}