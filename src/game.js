var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Game_instances, _Game_timerCount, _Game_timer, _Game_currentStep, _Game_answer, _Game_questionText, _Game_clickAlphabet, _Game_decreaseRemainingTime, _Game_nextStep, _Game_updateQuestionText, _Game_gameOver;
import { makeElementInvisible, makeElementVisible } from "./utils.js";
import { ANSWERS } from "./constants.js";
class Game {
    // 생성자
    constructor() {
        _Game_instances.add(this);
        // 타이머 카운트
        _Game_timerCount.set(this, void 0);
        // 타이머
        _Game_timer.set(this, void 0);
        // 현재 스텝
        _Game_currentStep.set(this, void 0);
        // 정답
        _Game_answer.set(this, void 0);
        // 문제 텍스트
        _Game_questionText.set(this, void 0);
        // 행맨 요소
        this.hangmanElement = document.querySelectorAll(".hangman > img");
        // 문제 텍스트 요소
        this.questionWordElement = document.querySelector(".question-word");
        // 정답 텍스트 요소
        this.answerWordElement = document.querySelector(".answer-word");
        // 메인 화면 요소
        this.mainWordElement = document.querySelector(".main-word");
        // 남은 시도 횟수 요소
        this.remainingAttemptsElement = document.querySelector("#remaining-attempts");
        // 남은 시간 요소
        this.remainingTimeElement = document.querySelector("#remaining-time");
        // 알파벳 버튼 요소
        this.alphabetButtons = document.querySelectorAll(".alphabet-button");
        // 이벤트 리스너 배열 타입 수정
        this.alphabetEventListeners = [];
        _Game_clickAlphabet.set(this, (button, resolve) => {
            const buttonElement = button;
            if (buttonElement) {
                buttonElement.disabled = true;
                buttonElement.style.opacity = '0';
            }
            if (__classPrivateFieldGet(this, _Game_answer, "f").includes(buttonElement.innerText)) {
                __classPrivateFieldGet(this, _Game_instances, "m", _Game_updateQuestionText).call(this, buttonElement.innerText);
                if (__classPrivateFieldGet(this, _Game_questionText, "f") === __classPrivateFieldGet(this, _Game_answer, "f"))
                    resolve(true);
            }
            else {
                if (this.hangmanElement) {
                    if (__classPrivateFieldGet(this, _Game_currentStep, "f") < this.hangmanElement.length - 1) {
                        __classPrivateFieldGet(this, _Game_instances, "m", _Game_nextStep).call(this);
                    }
                    else {
                        resolve(false);
                    }
                }
            }
        });
        _Game_gameOver.set(this, (result) => {
            // 타이머 삭제
            clearInterval(__classPrivateFieldGet(this, _Game_timer, "f"));
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
                    const buttonElement = button;
                    if (buttonElement) {
                        buttonElement.disabled = false;
                        buttonElement.style.opacity = '1';
                        buttonElement.removeEventListener("click", this.alphabetEventListeners[index]);
                    }
                });
            }
            return result;
        });
        // 타이머 카운트
        __classPrivateFieldSet(this, _Game_timerCount, 60, "f");
        // 현재 스텝
        __classPrivateFieldSet(this, _Game_currentStep, 0, "f");
        // 정답
        __classPrivateFieldSet(this, _Game_answer, ANSWERS[Math.floor(Math.random() * ANSWERS.length)], "f");
        // 문제 텍스트
        __classPrivateFieldSet(this, _Game_questionText, __classPrivateFieldGet(this, _Game_answer, "f")
            .split("")
            .reduce((acc, cur) => (cur === " " ? acc + " " : acc + "_"), ""), "f");
        // 남은 시간
        if (this.remainingTimeElement) {
            this.remainingTimeElement.innerText = __classPrivateFieldGet(this, _Game_timerCount, "f").toString();
        }
        if (this.questionWordElement) {
            this.questionWordElement.innerText = __classPrivateFieldGet(this, _Game_questionText, "f");
        }
        if (this.questionWordElement) {
            makeElementVisible(this.questionWordElement);
        }
        if (this.answerWordElement) {
            this.answerWordElement.innerText = `정답: ${__classPrivateFieldGet(this, _Game_answer, "f")}`;
            makeElementInvisible(this.answerWordElement);
        }
        // 게임 결과 반환 프로미스 생성
        this.gamePromise = new Promise((resolve) => {
            // 타이머 설정, 0초 도달 시 game over, 프로미스는 false를 resolve
            __classPrivateFieldSet(this, _Game_timer, setInterval(() => {
                if (__classPrivateFieldGet(this, _Game_timerCount, "f") <= 0)
                    resolve(false);
                else
                    __classPrivateFieldGet(this, _Game_instances, "m", _Game_decreaseRemainingTime).call(this);
            }, 1000), "f");
            // 알파벳 버튼 입력 이벤트 등록
            if (this.alphabetButtons) {
                this.alphabetButtons.forEach((button) => {
                    const buttonElement = button;
                    const onClick = () => {
                        __classPrivateFieldGet(this, _Game_clickAlphabet, "f").call(this, buttonElement, resolve);
                        buttonElement.removeEventListener("click", onClick);
                    };
                    this.alphabetEventListeners.push(onClick);
                    buttonElement.addEventListener("click", onClick);
                });
            }
        }).then(__classPrivateFieldGet(this, _Game_gameOver, "f"));
    }
}
_Game_timerCount = new WeakMap(), _Game_timer = new WeakMap(), _Game_currentStep = new WeakMap(), _Game_answer = new WeakMap(), _Game_questionText = new WeakMap(), _Game_clickAlphabet = new WeakMap(), _Game_gameOver = new WeakMap(), _Game_instances = new WeakSet(), _Game_decreaseRemainingTime = function _Game_decreaseRemainingTime() {
    var _a;
    __classPrivateFieldSet(this, _Game_timerCount, (_a = __classPrivateFieldGet(this, _Game_timerCount, "f"), _a--, _a), "f");
    if (this.remainingTimeElement) {
        this.remainingTimeElement.innerText = __classPrivateFieldGet(this, _Game_timerCount, "f").toString();
    }
}, _Game_nextStep = function _Game_nextStep() {
    var _a;
    __classPrivateFieldSet(this, _Game_currentStep, (_a = __classPrivateFieldGet(this, _Game_currentStep, "f"), _a++, _a), "f");
    if (this.hangmanElement) {
        Array.from(this.hangmanElement)
            .slice(0, __classPrivateFieldGet(this, _Game_currentStep, "f"))
            .forEach((item) => item.classList.remove("invisible"));
    }
}, _Game_updateQuestionText = function _Game_updateQuestionText(newAlphabet) {
    __classPrivateFieldSet(this, _Game_questionText, __classPrivateFieldGet(this, _Game_questionText, "f")
        .split("")
        .reduce((acc, cur, index) => {
        if (cur === " " || cur !== "_")
            return acc + cur;
        if (__classPrivateFieldGet(this, _Game_answer, "f")[index] === newAlphabet)
            return acc + newAlphabet;
        else
            return acc + "_";
    }, ""), "f");
    if (this.questionWordElement) {
        this.questionWordElement.innerText = __classPrivateFieldGet(this, _Game_questionText, "f");
    }
};
export default Game;
