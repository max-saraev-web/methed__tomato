export class Tomato {
  #taskDuration = 25;
  #pause = 5;
  #bigPause = 15;
  #tasks = [];
  #activeTask = null;
  constructor({taskDuration, pause, bigPause, tasks}) {
    this.#taskDuration = taskDuration;
    this.#pause = pause;
    this.#bigPause = bigPause;
    this.#tasks = tasks;
  }
  init() {
    this.addTask();

    const tasksList = document.querySelector('.tasks__list');
    const currentTasks = this.getStorage();
    console.log('currentTasks: ', currentTasks);

    // ? - начало li
    for (let i = 0; i < currentTasks.length; i++) {
      const listElem = document.createElement('li');
      listElem.classList.add('tasks__item', `${currentTasks[i].importance}`);
      listElem.dataset.id = currentTasks[i].id;

      const taskCount = document.createElement('span');
      taskCount.classList.add('count-number');
      taskCount.textContent = i + 1;

      const btnTask = document.createElement('button');
      btnTask.classList.add('tasks__text');
      btnTask.textContent = currentTasks[i][`task-name`];

      const btnBurger = document.createElement('button');
      btnBurger.classList.add('tasks__button');

      const popUpBtn = document.createElement('div');
      popUpBtn.classList.add('popup');

      const editBtn = document.createElement('button');
      editBtn.classList.add('popup__button', 'popup__edit-button');
      editBtn.textContent = 'Редактировать';

      const delBtn = document.createElement('button');
      delBtn.classList.add('popup__button', 'popup__delete-button');
      delBtn.textContent = 'Удалить';

      popUpBtn.append(editBtn, delBtn);

      listElem.append(taskCount, btnTask, btnBurger, popUpBtn);
      console.log('listElem: ', listElem);
      
    }
    // ? - конец li

    tasksList.addEventListener('click', ({target}) => {
      if (target.matches('.tasks__item')) console.log(target);
    });
  }
  addStorageTask(arr, task) {
    arr.push(task);
  }
  getStorage(key = 'tomatoTimer') {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
  }
  setStorage(obj, key = 'tomatoTimer') {
    localStorage.setItem(key, JSON.stringify(obj));
  }
  addTask() {
    const regex = /[a-zA-Zа-яА-ЯёЁ0-9]{3,}/;

    const form = document.querySelector('.task-form');
    const taskName = form.querySelector('.task-name');
    const submitBtn = form.querySelector('.task-form__add-button');
    const importance = form.querySelector('.button-importance');
    submitBtn.disabled = true;
    submitBtn.classList.add('task-form__add-button--disabled');

    taskName.addEventListener('input', ({target}) => {
      submitBtn.disabled = true;
      submitBtn.classList.add('task-form__add-button--disabled');
      if (regex.test(target.value)) {
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('task-form__add-button--disabled');
      }
    });

    form.addEventListener('submit', ev => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.target));
    data.importance = ([...importance.classList].filter(elem => {
      return elem === 'default' || elem === 'important' || elem === 'so-so';
    }))[0];
    data.id = this.generateId();
    console.log('форма принята');
    this.#tasks.push(data);
    const currentStorage = this.getStorage('tomatoTimer');
    this.addStorageTask(currentStorage, data)

    console.log('помидорки этого объекта', this.tasks);
    this.setStorage(currentStorage)
    console.log('localStorage', localStorage);
    form.reset();
  });
  }
  get tasks() {
    return this.#tasks;
  }
  get activeTask() {
    return this.#activeTask;
  }
  set activeTask(task) {
    this.#activeTask = task;
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
  // makeActive() {
    
  // }
  activateTask(id) {
    this.#activeTask = id;
  }
}