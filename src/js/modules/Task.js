export class Task {
  constructor(title, count = 0) {
    this.title = title;
    this.count = count;
    this.id = this.generateId();
    // this.id = Math.random().toString().substring(2, 10);
  }
  increaseCounter() {
    ++this.count;
  }
  setTitle(newTitle) {
    this.title = newTitle;
  }
  start() {
    let timerId;
    
  }
  generateId(min = 1, max = 9) {
  const fullId = [];

  for (let i = 0; i < 8; i++) {
    if (i === 0) {
      fullId[i] = Math.round(Math.random() * (max - min) + min);
    } else fullId.push(Math.round(Math.random() * (max - min) + min));
  }
  return fullId.join('');
  }
}