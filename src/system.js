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
var _System_instances, _System_count, _System_decreaseCount, _System_startGame, _System_start, _System_restart;
import { makeElementVisible, makeElementInvisible } from './utils.js';
import Game from "./game.js";
class System {
    // 생성자
    constructor() {
        _System_instances.add(this);
        // 남은 시도 횟수
        _System_count.set(this, void 0);
        // 남은 시도 횟수
        this.remainingAttempts = document.getElementById('remaining-attempts');
        // 정답 텍스트
        this.answerWord = document.querySelector('.answer-word');
        // 메인 화면
        this.mainWord = document.querySelector('.main-word');
        // 메인 화면 제목
        this.mainWordTitle = document.querySelector('.main-word-title');
        // 메인 화면 버튼
        this.mainWordButton = document.querySelector('.main-word-button');
        // 남은 시도 횟수 초기화
        __classPrivateFieldSet(this, _System_count, 7, "f");
        // 시작 화면 초기화
        this.remainingAttempts = document.getElementById('remaining-attempts');
        this.answerWord = document.querySelector('.answer-word');
        this.mainWord = document.querySelector('.main-word');
        this.mainWordTitle = document.querySelector('.main-word-title');
        this.mainWordButton = document.querySelector('.main-word-button');
        if (this.remainingAttempts) {
            this.remainingAttempts.innerText = __classPrivateFieldGet(this, _System_count, "f").toString();
        }
        if (this.mainWordButton) {
            if (this.mainWordButton.innerText === '시작하기') {
                this.mainWordButton.addEventListener('click', () => __classPrivateFieldGet(this, _System_instances, "m", _System_start).call(this));
            }
            else if (this.mainWordButton.innerText === '다시 시작') {
                this.mainWordButton.addEventListener('click', () => __classPrivateFieldGet(this, _System_instances, "m", _System_restart).call(this));
            }
        }
    }
    // 게임 초기화
    cleanup() {
        __classPrivateFieldSet(this, _System_count, 7, "f");
        if (this.remainingAttempts) {
            this.remainingAttempts.innerText = __classPrivateFieldGet(this, _System_count, "f").toString();
        }
        if (this.mainWordButton) {
            this.mainWordButton.removeEventListener('click', () => __classPrivateFieldGet(this, _System_instances, "m", _System_start).call(this));
            this.mainWordButton.removeEventListener('click', () => __classPrivateFieldGet(this, _System_instances, "m", _System_restart).call(this));
        }
        if (this.answerWord) {
            makeElementInvisible(this.answerWord);
        }
        if (this.mainWord) {
            makeElementInvisible(this.mainWord);
        }
    }
}
_System_count = new WeakMap(), _System_instances = new WeakSet(), _System_decreaseCount = function _System_decreaseCount() {
    var _a;
    __classPrivateFieldSet(this, _System_count, (_a = __classPrivateFieldGet(this, _System_count, "f"), _a--, _a), "f");
    if (this.remainingAttempts) {
        this.remainingAttempts.innerText = __classPrivateFieldGet(this, _System_count, "f").toString();
    }
}, _System_startGame = 
// 게임 시작 및 결과 업데이트
async function _System_startGame() {
    __classPrivateFieldGet(this, _System_instances, "m", _System_decreaseCount).call(this);
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
    }
    else {
        if (__classPrivateFieldGet(this, _System_count, "f") > 0) {
            if (this.mainWordTitle) {
                this.mainWordTitle.innerText = '실패했습니다!';
            }
            if (this.mainWordButton) {
                this.mainWordButton.innerText = '다시 시작';
            }
            if (this.mainWord) {
                makeElementVisible(this.mainWord);
            }
        }
        else {
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
}, _System_start = function _System_start() {
    if (this.mainWord) {
        makeElementInvisible(this.mainWord);
    }
    __classPrivateFieldGet(this, _System_instances, "m", _System_startGame).call(this);
}, _System_restart = function _System_restart() {
    if (this.mainWord) {
        makeElementInvisible(this.mainWord);
    }
    __classPrivateFieldGet(this, _System_instances, "m", _System_startGame).call(this);
};
export default System;
