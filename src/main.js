import './scss/index.scss';
import './index.html';
import Timer from './js/modules/classModules';

const timer = new Timer('Первый', 'Помой машину', 60);
console.log('timer: ', timer);

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