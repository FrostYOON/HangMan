import { makeElementInvisible, makeElementVisible } from "./utils.js";
import { ANSWERS } from "./constants.js";

class Game {
  // 타이머 카운트
  #timerCount;
  // 타이머
  #timer;
  // 현재 스텝
  #currentStep;
  // 정답
  #answer;
  // 문제 텍스트
  #questionText;

  // 행맨 요소
  hangmanElement = document.querySelectorAll(".hangman > img");
  // 문제 텍스트 요소
  questionWordElement = document.querySelector(".question-word");
  // 정답 텍스트 요소
  answerWordElement = document.querySelector(".answer-word");
  // 메인 화면 요소
  mainWordElement = document.querySelector(".main-word");
  // 남은 시도 횟수 요소
  remainingAttemptsElement = document.querySelector("#remaining-attempts");
  // 남은 시간 요소
  remainingTimeElement = document.querySelector("#remaining-time");
  // 알파벳 버튼 요소
  alphabetButtons = document.querySelectorAll(".alphabet-button");

  alphabetEventListeners = [];

  // 생성자
  constructor() {
    // 타이머 카운트
    this.#timerCount = 60;
    // 현재 스텝
    this.#currentStep = 0;
    // 정답
    this.#answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    console.log(this.#answer);

    // 문제 텍스트
    this.#questionText = this.#answer
      .split("")
      .reduce((acc, cur) => (cur === " " ? acc + " " : acc + "_"), "");

    // 남은 시간
    this.remainingTimeElement.innerText = this.#timerCount;
    this.questionWordElement.innerText = this.#questionText;

    makeElementVisible(this.questionWordElement);

    this.answerWordElement.innerText = `정답: ${this.#answer}`;
    makeElementInvisible(this.answerWordElement);

    // 게임 결과 반환 프로미스 생성
    return new Promise((resolve) => {
      // 타이머 설정, 0초 도달 시 game over, 프로미스는 false를 resolve
      this.#timer = setInterval(() => {
        if (this.#timerCount <= 0) resolve(false);
        else this.#decreaseRemainingTime();
      }, 1000);

      // 알파벳 버튼 입력 이벤트 등록
      this.alphabetButtons.forEach((button) => {
        const onClick = () => {
          this.#clickAlphabet(button, resolve);
          button.removeEventListener("click", onClick);
        };
        this.alphabetEventListeners.push(onClick);
        button.addEventListener("click", onClick);
      });
    }).then(this.#gameOver);
  }

  #clickAlphabet = (button, resolve) => {
    // 버튼 요소 투명도 설정 및 비활성화
    button.disabled = true;
    button.style.opacity = 0;

    if (this.#answer.includes(button.innerText)) {
      this.#updateQuestionText(button.innerText);
      if (this.#questionText === this.#answer) resolve(true);
    } else {
      if (this.#currentStep < this.hangmanElement.length - 1) {
        this.#nextStep();
      } else {
        resolve(false);
      }
    }
  };

  #decreaseRemainingTime() {
    this.#timerCount--;
    this.remainingTimeElement.innerText = this.#timerCount;
  }
  

  #nextStep() {
    this.#currentStep++;
    Array.from(this.hangmanElement)
      .slice(0, this.#currentStep)
      .forEach((item) => item.classList.remove("invisible"));
  }

  #updateQuestionText(newAlphabet) {
    this.#questionText = this.#questionText
      .split("")
      .reduce((acc, cur, index) => {
        if (cur === " " || cur !== "_") return acc + cur;
        if (this.#answer[index] === newAlphabet) return acc + newAlphabet;
        else return acc + "_";
      }, "");

    this.questionWordElement.innerText = this.#questionText;
  }

  #gameOver = (result) => {
    // 타이머 삭제
    clearInterval(this.#timer);

    // 정답 보여주기
    makeElementVisible(this.answerWordElement);
    makeElementVisible(this.mainWordElement);

    // DOM 상태 초기화
    this.hangmanElement.forEach((item) => item.classList.add("invisible"));
    makeElementInvisible(this.questionWordElement);
    this.alphabetButtons.forEach((button, index) => {
      button.disabled = false;
      button.style.opacity = 1;
      button.removeEventListener("click", this.alphabetEventListeners[index]);
    });
    return result;
  };
}

export default Game;
