class Timer {
  #name;
  constructor(id, name, countDown) {
    if (typeof id !== 'string') throw new Error('ID должен быть строкой');
    if (typeof name !== 'string') throw new Error('name должен быть строкой');
    if (typeof countDown !== 'number') throw new Error('countDown должен быть числом');
    this.id = id;
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
