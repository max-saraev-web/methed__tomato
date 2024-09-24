import messages from "../messages";

export class Tomato {
  #taskDuration = 25;
  #pause = 5;
  #bigPause = 15;
  #tasks = [];
  #activeTask = null;
  constructor({taskDuration, pause, bigPause, tasks}, lang) {
    this.#taskDuration = taskDuration;
    this.#pause = pause;
    this.#bigPause = bigPause;
    this.#tasks = tasks;
    this.lang = lang;
  }
  init() {
    this.addTask();
    const activeTask = this.isActive()[0];
    console.log('activeTAask11: ', activeTask);
    if (activeTask) this.activateTask(activeTask);
    console.log('она активна????', this.#activeTask);

    const tasksList = document.querySelector('.tasks__list');

    if (this.#activeTask) {
      this.renderWindow(this.#activeTask);
    } else {
      this.renderWindow();
    }
    this.renderList(tasksList);
    this.listControl(tasksList);

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
    data.isActive = false;
    data.count = 0;
    console.log('форма принята');
    this.#tasks.push(data);
    const currentStorage = this.getStorage('tomatoTimer');
    this.addStorageTask(currentStorage, data)

    console.log('помидорки этого объекта', this.tasks);
    this.setStorage(currentStorage)
    console.log('localStorage', localStorage);
    form.reset();

    // ! - убрать куда-то
    const tasksList = document.querySelector('.tasks__list');
    this.renderList(tasksList);
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
  activateTask(obj) {
    this.#activeTask = obj;
  }
  disableTask() {
    this.#activeTask = null;
  }
  //* - Методы не добавленные в основу!
  renderWindow(obj = null) {
    console.log(obj);
    const {[this.lang]: {noTask, tomato}} = messages;

    const pomodoroWindow = document.querySelector('.pomodoro-form');
    pomodoroWindow.querySelector('.window__panel').remove();

    const header = document.createElement('div');
    header.classList.add('window__panel');

    const taskName = document.createElement('p');
    taskName.classList.add('window__panel-title');
    taskName.textContent = obj ? obj['task-name'] : noTask;

    const counter = document.createElement('p');
    counter.classList.add('window__panel-task-text');
    counter.textContent = `${tomato} ${obj?.count ? obj.count : 1}`;


    header.append(taskName, counter);

    pomodoroWindow.prepend(header);

  }
  renderList(list) {
    list.textContent = '';
    for (let i = 0; i < this.#tasks.length; i++) {
      const listElem = document.createElement('li');
      listElem.classList.add('tasks__item', `${this.#tasks[i].importance}`);
      listElem.dataset.id = this.#tasks[i].id;

      const taskCount = document.createElement('span');
      taskCount.classList.add('count-number');
      taskCount.textContent = i + 1;

      const btnTask = document.createElement('button');
      if (this.#tasks[i].isActive === true) {
        btnTask.classList.add('tasks__text', 'tasks__text_active');
      } else {
        btnTask.classList.add('tasks__text');
      }
      btnTask.textContent = this.#tasks[i][`task-name`];

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
      list.append(listElem);
    }
  }
  listControl(list) {
    const listItems = [...list.querySelectorAll('.tasks__text')];

    list.addEventListener('click', ({target}) => {
      if (target.matches('.tasks__text')) {
        listItems.forEach(elem => elem.classList.remove('tasks__text_active'));
        const id = target.parentElement.dataset.id;
        target.classList.add('tasks__text_active');
        this.disableTask();
        const currentStorage = this.getStorage();
        console.log('currentStorage: изначальный', currentStorage);
        currentStorage.forEach((elem, i) => {
          elem.isActive = false;
          if (elem.id === id) {
            currentStorage[i].isActive = true;
            this.activateTask(currentStorage[i]);
            console.log(currentStorage[i]);
          };
        });
        console.log('currentStorage: обновлённый', currentStorage);
        this.setStorage(currentStorage);
        this.renderWindow(this.#activeTask);
      };
      if (target.matches('.tasks__button')) {
        const clickNum = [...list.querySelectorAll('.tasks__button')].findIndex(elem => elem === target);
        const popups = [...list.querySelectorAll('.popup')];
        
      if (popups[clickNum].classList.contains('popup_active')) {
        popups[clickNum].classList.remove('popup_active');
      } else {
        popups.forEach((elem) => {
          elem.classList.remove('popup_active');
        });

        popups[clickNum].classList.add('popup_active');
      }
      }
    });

  }
  collectTasks() {
    const savedTasks = this.getStorage();
    for (const task of savedTasks) {
      this.#tasks.push(task);
    }
  }
  isActive() {
    const savedTasks = this.getStorage();
    console.log('savedTasks: ', savedTasks);
    return savedTasks.filter(elem => elem.isActive);
  }
}