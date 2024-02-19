import Timer from "./Timer";

class Tomato {
  #taskList = [];
  constructor({time = 25,
    pause = 5,
    longPause = 15,
    tasks = []} = {}) {
      this.time = time;
      this.pause = pause;
      this.longPause = longPause;
      this.tasks = tasks;
      this.activeTask = null;
  }
  init() {
    for (let i = 0; i < this.tasks.length; i++) {
      this.addTask(new Timer(this.tasks[i]));      
    }
  }
  addTask(obj) {
    this.#taskList.push(typeof obj === 'string' ?
      new Timer(obj) : obj);
  }
  makeActive(id) {
    if (typeof id === 'string') {
      this.#taskList.forEach(elem => {
        if (elem.id === id) {
          this.activeTask = elem;
          this.startTask(elem);
        };
      })
    }
  }
  makeDisabled() {
    this.activeTask = null;
  }
  startPause(counter) {
    if(counter === 3) {
      let timeMs = getMs(this.longPause);
      const timer = setInterval(() => {
          timeMs  -= 1000;
        if (timeMs === 0) {
          clearInterval(timer);
          console.log('Длинная пауза завершена');
        };
      }, 1000);
    } else {
      let timeMs = getMs(this.pause);
      const timer = setInterval(() => {
          timeMs  -= 1000;
        if (timeMs === 0) {
          clearInterval(timer);
          console.log('Короткая пауза завершена');
        };
      }, 1000);
    }
  }
  startTask(task) {
    try {
      if (this.activeTask) { 
        let timeMs = getMs(task.time);
        const timer = setInterval(() => {
          timeMs  -= 1000;
          console.log(timeMs);
          if (timeMs === 0) {
            task.addOne(task.id);
            clearInterval(timer);
            this.startPause(task.counter);
            console.log("Помидор завершён");
          }
        }, 1000);
      }
      throw new Error('Активных задач - нет.');
    } catch (error) {
      console.log(error);
    }
  }
  static getMs(time) {
    return time * 60000;
  }
}

export default Tomato;