import System from './system.js';

window.addEventListener('DOMContentLoaded', () => {
  const mainWordButton = document.querySelector('.main-word-button');
  const answerWord = document.querySelector('.answer-word');
  let system = new System();

  mainWordButton.addEventListener('click', () => {
    system.cleanup();
    makeElementInvisible(answerWord);
    system = new System();
  });
});
