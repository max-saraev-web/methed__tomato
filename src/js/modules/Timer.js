class Timer {
  #name = null;
  #time = 0;
  constructor(name, counter = 1, time) {
    if (typeof name !== 'string') throw new Error('name должен быть строкой');
    if (typeof counter !== 'number') throw new Error('countDown должен быть числом');
    this.id = String(Date.now() + Math.floor(Math.random()*1000));
    this.#name = name;
    this.counter = counter;
  }
  get time() {
    return this.#time;
  }
  set time(time) {
    this.#time = time;
  }
  addOne(id) {
    if(this.id === id) {
      this.counter++;
      return this;
    }
  }
  get name() {
    return this.#name;
  }
  set name(newName) {
    if (typeof newName !== 'string') throw new Error('name должен быть строкой');
    this.#name = newName;
  }
}

export default Timer;
