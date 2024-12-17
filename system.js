import { makeElementVisible, makeElementInvisible } from './utils.js';
import Game from "./game.js";

class System {
  // 남은 시도 횟수
  #count;

  // 남은 시도 횟수
  remainingAttempts = document.getElementById('remaining-attempts');
  // 정답 텍스트
  answerWord = document.querySelector('.answer-word');
  // 메인 화면
  mainWord = document.querySelector('.main-word');
  // 메인 화면 제목
  mainWordTitle = document.querySelector('.main-word-title');
  // 메인 화면 버튼
  mainWordButton = document.querySelector('.main-word-button');

  // 생성자
  constructor() {
    // 남은 시도 횟수 초기화
    this.#count = 7;

    // 시작 화면 초기화
    this.remainingAttempts.innerText = this.#count;

    makeElementVisible(this.mainWord);
    if (this.mainWordButton.innerText === '시작하기') {
      this.mainWordButton.addEventListener('click', () => this.#start());
    }else if (this.mainWordButton.innerText === '다시 시작') {
      this.mainWordButton.addEventListener('click', () => this.#restart());
    }
  }

  // 남은 시도 횟수 감소
  #decreaseCount() {
    this.#count--;
    this.remainingAttempts.innerText = this.#count;
  }

  // 게임 시작 및 결과 업데이트
  async #startGame() {
    this.#decreaseCount();
    const result = await new Game();

    if (result) {
      this.mainWordTitle.innerText = '성공했습니다!';
      this.mainWordButton.innerText = '처음부터 다시하기';
      makeElementVisible(this.mainWord);
    } else {
      if (this.#count > 0) {
        this.mainWordTitle.innerText = '실패했습니다!';
        this.mainWordButton.innerText = '다시 시작';
        makeElementVisible(this.mainWord);
      } else {
        this.mainWordTitle.innerText = '기회를 모두 사용했습니다';
        this.mainWordButton.innerText = '처음부터 다시하기';
        makeElementVisible(this.mainWord);
      }
    }
  }

  // 게임 시작
  #start() {
    makeElementInvisible(this.mainWord);
    this.#startGame();
  }

  // 게임 재시작
  #restart() {
    makeElementInvisible(this.mainWord);
    this.#startGame();
  }

  // 게임 초기화
  cleanup() {
    this.remainingAttempts.innerText = 7;
    this.mainWordButton.removeEventListener('click', () => this.#start());
    this.mainWordButton.removeEventListener('click', () => this.#restart());
    makeElementInvisible(this.answerWord);
    makeElementVisible(this.mainWord);
  }
}

export default System;
