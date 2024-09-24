import './scss/index.scss';
import './index.html';
import { Tomato } from './scripts/modules/Tomato';

let count = 0;
const imp = ['default', 'important', 'so-so'];
document.querySelector('.button-importance')
  .addEventListener('click', ({target}) => {
    count += 1;
    if (count >= imp.length) {
      count = 0;
    }

    for (let i = 0; i < imp.length; i++) {
      if (count === i) {
        target.classList.add(imp[i]);
      } else {
        target.classList.remove(imp[i]);
      }
    }
  });

document.addEventListener('DOMContentLoaded', () => {

  const app = new Tomato({
    taskDuration: 25,
    pause: 5,
    bigPause: 15,
    tasks: [],
  }, 'ru');
  
  app.collectTasks();
  app.init();
  console.log(app);
});