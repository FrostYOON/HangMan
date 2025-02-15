import System from "./system.js";
import { makeElementInvisible } from "./utils.js";

window.addEventListener('DOMContentLoaded', () => {
  let mainWordButton: HTMLElement | null = document.querySelector('.main-word-button');
  const answerWord: HTMLElement | null = document.querySelector('.answer-word');
  let system = new System();

  if (mainWordButton) {
    mainWordButton.addEventListener('click', () => {
      if (mainWordButton.innerText === '처음부터 다시하기') {
        system.cleanup();
        if (answerWord) {
          makeElementInvisible(answerWord);
        }
        system = new System();
      }
    });
  }
});
