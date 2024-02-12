class Timer {
  #name;
  constructor(name, countDown) {
    if (typeof name !== 'string') throw new Error('name должен быть строкой');
    if (typeof countDown !== 'number') throw new Error('countDown должен быть числом');
    this.id = Date.now() + Math.floor(Math.random()*1000);
    this.#name = name;
    this.countDown = countDown;
  }
  addOne() {
    this.countDown++;
    return this;
  }
  get name() {
    return this.#name;
  }
  set name(newName) {
    this.#name = newName;
  }
}

export default Timer;
