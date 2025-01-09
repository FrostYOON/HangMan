import { makeElementInvisible, makeElementVisible } from "./utils.js";
import { ANSWERS } from "./constants.js";

class Game {
  // 타이머 카운트
  #timerCount: number;
  // 타이머
  #timer: number;
  // 현재 스텝
  #currentStep: number;
  // 정답
  #answer: string;
  // 문제 텍스트
  #questionText: string;

  // 행맨 요소
  hangmanElement: NodeListOf<Element> | null = document.querySelectorAll(".hangman > img");
  // 문제 텍스트 요소
  questionWordElement: HTMLElement | null = document.querySelector(".question-word");
  // 정답 텍스트 요소
  answerWordElement: HTMLElement | null = document.querySelector(".answer-word");
  // 메인 화면 요소
  mainWordElement: HTMLElement | null = document.querySelector(".main-word");
  // 남은 시도 횟수 요소
  remainingAttemptsElement: HTMLElement | null = document.querySelector("#remaining-attempts");
  // 남은 시간 요소
  remainingTimeElement: HTMLElement | null = document.querySelector("#remaining-time");
  // 알파벳 버튼 요소
  alphabetButtons: NodeListOf<Element> | null = document.querySelectorAll(".alphabet-button");

  // 이벤트 리스너 배열 타입 수정
  alphabetEventListeners: Array<() => void> = [];

  // 게임 프로미스
  gamePromise: Promise<boolean>;

  // 생성자
  constructor() {
    // 타이머 카운트
    this.#timerCount = 60;
    // 현재 스텝
    this.#currentStep = 0;
    // 정답
    this.#answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];

    // 문제 텍스트
    this.#questionText = this.#answer
      .split("")
      .reduce((acc: string, cur: string) => (cur === " " ? acc + " " : acc + "_"), "");

    // 남은 시간
    if (this.remainingTimeElement) {
      this.remainingTimeElement.innerText = this.#timerCount.toString();
    }
    if (this.questionWordElement) {
      this.questionWordElement.innerText = this.#questionText;
    }

    if (this.questionWordElement) {
      makeElementVisible(this.questionWordElement);
    }

    if (this.answerWordElement) {
      this.answerWordElement.innerText = `정답: ${this.#answer}`;
      makeElementInvisible(this.answerWordElement);
    }
    

    // 게임 결과 반환 프로미스 생성
    this.gamePromise = new Promise<boolean>((resolve) => {
      // 타이머 설정, 0초 도달 시 game over, 프로미스는 false를 resolve
      this.#timer = setInterval(() => {
        if (this.#timerCount <= 0) resolve(false);
        else this.#decreaseRemainingTime();
      }, 1000);

      // 알파벳 버튼 입력 이벤트 등록
      if (this.alphabetButtons) {
        this.alphabetButtons.forEach((button) => {
          const buttonElement = button as HTMLButtonElement;
          const onClick = () => {
            this.#clickAlphabet(buttonElement, resolve);
            buttonElement.removeEventListener("click", onClick);
          };
          this.alphabetEventListeners.push(onClick);
          buttonElement.addEventListener("click", onClick);
        });
      }
    }).then(this.#gameOver);
  }

  #clickAlphabet = (button: Element, resolve: (value: boolean) => void) => {
    const buttonElement = button as HTMLButtonElement;
    if (buttonElement) {
      buttonElement.disabled = true;
      buttonElement.style.opacity = '0';
    }

    if (this.#answer.includes(buttonElement.innerText)) {
      this.#updateQuestionText(buttonElement.innerText);
      if (this.#questionText === this.#answer) resolve(true);
    } else {
      if (this.hangmanElement) {
        if (this.#currentStep < this.hangmanElement.length - 1) {
          this.#nextStep();
        } else {
          resolve(false);
        }
      }
    }
  };

  #decreaseRemainingTime() {
    this.#timerCount--;
    if (this.remainingTimeElement) {
      this.remainingTimeElement.innerText = this.#timerCount.toString();
    }
  }
  

  #nextStep() {
    this.#currentStep++;
    if (this.hangmanElement) {
      Array.from(this.hangmanElement)
        .slice(0, this.#currentStep)
        .forEach((item) => item.classList.remove("invisible"));
    }
  }

  #updateQuestionText(newAlphabet: string) {
    this.#questionText = this.#questionText
      .split("")
      .reduce((acc: string, cur: string, index: number) => {
        if (cur === " " || cur !== "_") return acc + cur;
        if (this.#answer[index] === newAlphabet) return acc + newAlphabet;
        else return acc + "_";
      }, "");

    if (this.questionWordElement) {
      this.questionWordElement.innerText = this.#questionText;
    }
  }

  #gameOver = (result: boolean) => {
    // 타이머 삭제
    clearInterval(this.#timer);

    // 정답 보여주기
    if (this.answerWordElement) {
      makeElementVisible(this.answerWordElement);
    }
    if (this.mainWordElement) {
      makeElementVisible(this.mainWordElement);
    }

    // DOM 상태 초기화
    if (this.hangmanElement) {
      this.hangmanElement.forEach((item) => item.classList.add("invisible"));
    }
    if (this.questionWordElement) {
      makeElementInvisible(this.questionWordElement);
    }

    if (this.alphabetButtons) {
      this.alphabetButtons.forEach((button, index) => {
        const buttonElement = button as HTMLButtonElement;
        if (buttonElement) {
          buttonElement.disabled = false;
          buttonElement.style.opacity = '1';
          buttonElement.removeEventListener("click", this.alphabetEventListeners[index]);
        }
      });
    }
    return result;
  };
}

export default Game;
