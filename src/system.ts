import { makeElementVisible, makeElementInvisible } from './utils.js';
import Game from "./game.js";

class System {
  // 남은 시도 횟수
  #count: number;

  // 남은 시도 횟수
  remainingAttempts: HTMLElement | null = document.getElementById('remaining-attempts');
  // 정답 텍스트
  answerWord: HTMLElement | null = document.querySelector('.answer-word');
  // 메인 화면
  mainWord: HTMLElement | null = document.querySelector('.main-word');
  // 메인 화면 제목
  mainWordTitle: HTMLElement | null = document.querySelector('.main-word-title');
  // 메인 화면 버튼
  mainWordButton: HTMLElement | null = document.querySelector('.main-word-button');

  // 생성자
  constructor() {
    // 남은 시도 횟수 초기화
    this.#count = 7;

    // 시작 화면 초기화
    this.remainingAttempts = document.getElementById('remaining-attempts');
    this.answerWord = document.querySelector('.answer-word');
    this.mainWord = document.querySelector('.main-word');
    this.mainWordTitle = document.querySelector('.main-word-title');
    this.mainWordButton = document.querySelector('.main-word-button');

    if (this.remainingAttempts) {
      this.remainingAttempts.innerText = this.#count.toString();
    }
    if (this.mainWordButton) {
      if (this.mainWordButton.innerText === '시작하기') {
        this.mainWordButton.addEventListener('click', () => this.#start());
      }else if (this.mainWordButton.innerText === '다시 시작') {
        this.mainWordButton.addEventListener('click', () => this.#restart());
      }
    }
  }

  // 남은 시도 횟수 감소
  #decreaseCount() {
    this.#count--;
    if (this.remainingAttempts) {
      this.remainingAttempts.innerText = this.#count.toString();
    }
  }

  // 게임 시작 및 결과 업데이트
  async #startGame() {
    this.#decreaseCount();
    const game = new Game();
    
    // gamePromise가 완료될 때까지 기다림
    const result = await game.gamePromise;

    if (result) {
      if (this.mainWordTitle) {
        this.mainWordTitle.innerText = '성공했습니다!';
      }
      if (this.mainWordButton) {
        this.mainWordButton.innerText = '처음부터 다시하기';
      }
      if (this.mainWord) {
        makeElementVisible(this.mainWord);
      }
    } else {
      if (this.#count > 0) {
        if (this.mainWordTitle) {
          this.mainWordTitle.innerText = '실패했습니다!';
        }
        if (this.mainWordButton) {
          this.mainWordButton.innerText = '다시 시작';
        }
        if (this.mainWord) {
          makeElementVisible(this.mainWord);
        }
      } else {
        if (this.mainWordTitle) {
          this.mainWordTitle.innerText = '기회를 모두 사용했습니다';
        }
        if (this.mainWordButton) {
          this.mainWordButton.innerText = '처음부터 다시하기';
        }
        if (this.mainWord) {
          makeElementVisible(this.mainWord);
        }
      }
    }
  }

  // 게임 시작
  #start() {
    if (this.mainWord) {
      makeElementInvisible(this.mainWord);
    }
    this.#startGame();
  }

  // 게임 재시작
  #restart() {
    if (this.mainWord) {
      makeElementInvisible(this.mainWord);
    }
    this.#startGame();
  }

  // 게임 초기화
  cleanup() {
    this.#count = 7;
    if (this.remainingAttempts) {
      this.remainingAttempts.innerText = this.#count.toString();
    }
    if (this.mainWordButton) {
      this.mainWordButton.removeEventListener('click', () => this.#start());
      this.mainWordButton.removeEventListener('click', () => this.#restart());
    }
    if (this.answerWord) {
      makeElementInvisible(this.answerWord);
    }
    if (this.mainWord) {
      makeElementInvisible(this.mainWord);
    }
  }
}

export default System;
