class Tomato {
  #taskDuration = 25;
  #pause = 5;
  #bigPause = 15;
  #tasks = [];
  #activeTask = null;
  constructor({taskDuration, pause, bigPause}) {
    this.#taskDuration = taskDuration;
    this.#pause = pause;
    this.#bigPause = bigPause;
  }
  addTask(task) {
    this.#tasks.push(task);
  }
  makeTaskActive(task) {
    this.#activeTask = task;
  }
  startTask() {
    try {
      if (!this.#activeTask) throw new Error('Активной задачи не найденно!');
      this.#activeTask.start();
    } catch (error) {
      console.warn(error);
    }
  }
}

export default Tomato;
