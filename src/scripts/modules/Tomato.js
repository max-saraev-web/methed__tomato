import messages from "../messages";

export class Tomato {
  #taskDuration = 25;
  #pause = 5;
  #bigPause = 15;
  #tasks = [];
  #activeTask = null;
  #timerID;
  #stepCount = 0;
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
    if (activeTask) this.activateTask(activeTask);

    const tasksList = document.querySelector('.tasks__list');
    const timerWindow = document.querySelector('.window');


    if (this.#activeTask) {
      this.renderWindow(this.#activeTask);
    } else {
      this.renderWindow();
    }
    this.renderList(tasksList);
    this.listControl(tasksList);

    timerWindow.addEventListener('click', ({target}) => {
      const {[this.lang]: {timerStart, timerStop}} = messages;
      const timerTrigger = document.querySelector('.timer-trigger');
      const timerOutput = timerWindow.querySelector('.window__timer-text');

      // ! - сделать замыкание на нужное время
      if (target.matches('.timer-trigger') && this.#activeTask) {
        const {minutes} = this.getTargetTime(this.#stepCount);
        if (this.#timerID) {
          target.textContent = timerStart;
          clearInterval(this.#timerID);
          this.#timerID = null;
          timerOutput.textContent = `${minutes}`;
        } else {
          this.startTask(this.getTargetTime(this.#stepCount));
          target.textContent = timerStop;
        }
        } 
      // if (target.matches('.timer-trigger') && this.#isRunnig === true && switcher) {
      //     console.log('страшно вырубай');
      //     this.#isRunnig = false; 
      // }
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
  activateTask(obj) {
    this.#activeTask = obj;
    const timerTrigger = document.querySelector('.timer-trigger');
    timerTrigger.style.filter = 'grayscale(0)';
  }
  disableTask() {
    this.#activeTask = null;
  }
  renderWindow(obj = null) {
    const timerTrigger = document.querySelector('.timer-trigger');
    if (!obj) timerTrigger.style.filter = 'grayscale(100%)';

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
    // ! - проблема что выбрать obj.count или stepCount
    counter.textContent = `${tomato} ${obj?.count ? obj.count : 1}`;

    const timer = document.querySelector('.window__timer-text');
    timer.textContent = `${this.#taskDuration}:00`

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
    return savedTasks.filter(elem => elem.isActive);
  }

  getTargetTime(gear) {
    let targetTime; 
    let minutes;

    switch(gear) {
      case 0 :
      case 2 :
      case 4 :
        targetTime = this.#taskDuration * 60 * 1000;
        minutes = this.#taskDuration;
        break;
      case 1 :
      case 3 :
        targetTime = this.#pause * 60 * 1000;
        minutes = this.#pause;
        break;
      case 5 :
        targetTime = this.#bigPause * 60 * 1000;
        minutes = this.#bigPause;
        break;
    }
    return {targetTime, minutes};
  }
  startTask({targetTime, minutes}) {
    const timeOutput = document.querySelector('.window__timer-text');

    // let remaining = targetTime(this.#stepCount);
    const stop = Date.now() + targetTime;

    const timerStarter = () => {
      const dataTime = this.getTimeRemamning(stop);
      const {minutes, seconds, timeRemaning } = dataTime;
      console.log(timeRemaning);
      timeOutput.textContent = `${minutes}:${seconds}`;
      this.#timerID = setTimeout(timerStarter, 1000)
      if (timeRemaning <= 0) {
        if (timeRemaning <= 0 && this.#stepCount === 5) this.#stepCount = 0;
        console.log(this.#stepCount);
        this.#stepCount ++;
        const hoba = this.getTargetTime(this.#stepCount)
        timeOutput.textContent = `${hoba.minutes}: 00`;
        console.log(messages);
        console.log(this.#stepCount);
        clearTimeout(this.#timerID);
        };
    };
    timerStarter();
  } 
  getTimeRemamning(stopTime) {
    const timeRemaning = stopTime - Date.now();

    const min = Math.floor(timeRemaning / 1000 / 60 % 60) + '';
    const sec = Math.floor(timeRemaning / 1000 % 60) + '';

    return {
      minutes: min.padStart(2, 0),
      seconds: sec.padStart(2, 0),
      timeRemaning,
    }
  }
}