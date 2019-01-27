// 每个任务组
import Logger from "../libs/Logger";
import Sleep from "../libs/Sleep";

export default class Task {
  constructor(func, time, step) {
    this.func = func; // Function 需要执行的任务
    this.time = time; // Number 间隔多长时间执行一次
    this.step = step; // Number 该任务是总任务的第几步
    /**
     * status
     * {type} Number 状态
     *【0 任务未开启】
     *【1 事务函数正在执行】
     *【2 事务函数已经运行完成，等待间隔函数执行】
     *【3 间隔函数正在执行】
     *【4 间隔函数已经运行完成，此处将该任务状态清零且将执行下一步任务】
     */
    this.status = 0;
  }
  
  // 循环任务事务函数
  taskRun = async () => {
    this.status = 1;
    try {
      await this.func() // 执行事务函数
    } catch (e) {
      throw e;
      Logger.error(e);
    }
    this.status = 2
  };
  
  // 循环任务间隔函数
  taskSleep = async () => {
    this.status = 3;
    await Sleep(this.time); // 执行间隔函数
    this.status = 4
  };
  
  // 循环任务状态清除函数
  taskClear = async () => {
    this.status = 0
  }
  
  runTask = () => {
    // console.log('Task', 'runTask')
    //运行中的不予处理
    //状态为1代表循环任务执行函数正在执行
    if (this.status === 1)
      return this.status;
    
    // 状态为3代表循环任务间隔函数正在执行
    if (this.status === 3)
      return this.status;
    
    // 状态为2代表循环任务执行函数已经运行完成，等待间隔函数执行
    if (this.status === 2) {
      this.taskSleep();
      return this.status
    }
    
    // 状态为4代表循环任务间隔函数已经运行完成，此处将状态清零且将执行下一步
    if (this.status === 4) {
      this.taskClear();
      return this.status
    }
    
    // 状态为0代表未进行循环任务执行函数
    if (this.status === 0) {
      this.taskRun();
      return this.status
    }
  }
}