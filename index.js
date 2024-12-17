import System from "./system.js";
import { makeElementInvisible } from "./utils.js";

window.addEventListener('DOMContentLoaded', () => {
  let mainWordButton = document.querySelector('.main-word-button');
  const answerWord = document.querySelector('.answer-word');
  const system = new System();

  Array.from(mainWordButton).forEach((button) => {
    button.addEventListener('click', () => {
      system.cleanup();
      makeElementInvisible(answerWord);
      system = new System();
    });
  });
});
