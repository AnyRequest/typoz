import { createEl, createName, getCursorStyle } from '../utils/feature.js';
export default class TypeNode {
    /**
     * @static
     * @property {number} id 타입노드 auto increment id
     */
    static id = 0;
    /** @property {number} id 타입노드 고유 id */
    id;
    /** @property {string} name 타입노드 고유 랜덤 네임 */
    name;
    /** @property {string[][][]} typingList 파싱된 타이핑 3차 배열 */
    typingList = [];
    /** @property {OmitNodesOptions} config 타입노드 설정 */
    config;
    // before: number = 0;
    /** @property {HTMLTypozElement} element 타입노드 지정 요소 */
    element;
    /**
     * @property {boolean} isStarted 렌더링 시작 여부
     * @default false
     */
    isStarted = false;
    /** @property {string} injectStyle 주입 스타일 텍스트 */
    injectStyle;
    /**
     * @private
     * @property {number} order 주입 스타일 텍스트
     * @default 0
     */
    order = 0;
    /**
     * @private
     * @property {boolean} stop 정지 신호
     * @default false
     */
    stop = false;
    /**
     * @private
     * @property {(value: boolean) => void} play 렌더링 시작 resolver
     */
    play;
    constructor(
    // id: number,
    el, config, typings) {
        this.id = ++TypeNode.id;
        this.element = el;
        this.name = createName();
        this.config = config;
        this.typingList = typings.filter((_) => _ && _.length > 0 && _[0].length > 0 && _[0][0].length > 0);
        this.setup();
    }
    /**
     * @method orderUp 타이핑 순서 증가
     * @description 0에서 타이핑 배열의 갯수-1 까지 순환 증가합니다.
     * @example
     * // typingList.length === 3
     * // current order === 3
     * orderUp();
     * // current order === 0
     */
    orderUp() {
        this.order = (this.order + 1) % this.typingList.length || 0;
    }
    /**
     * @private
     * @method setup 타입노드 초기화 메서드
     */
    setup() {
        Object.freeze(this.typingList);
        Object.freeze(this.config);
        this.element.innerHTML = '';
        this.element.setAttribute('typoz-id', '' + this.id);
        this.element.setAttribute('typoz-name', this.name);
        this.element.setAttribute('typoz-processed', '');
        this.injectStyle = getCursorStyle(this.config.style.cursor, this.name);
    }
    /**
     * @private
     * @method copyCurrent 타이핑 항목 복사
     * @returns {string[][]} Returns string array
     */
    copyCurrent() {
        try {
            const current = JSON.parse(JSON.stringify(this.typingList[this.order]));
            return current;
        }
        catch (error) {
            console.error('TypeNode was destroyed. [name: ' + this.name + ']', error);
            return [];
        }
    }
    /**
     * @method resume 렌더링 다시 재생
     */
    /* istanbul ignore next */
    resume() {
        this.play(true);
        this.stop = false;
    }
    /**
     * @method pause 렌더링 정지
     */
    /* istanbul ignore next */
    pause() {
        this.stop = true;
    }
    /**
     * @method clear 렌더링 시작 초기화
     */
    /* istanbul ignore next */
    clear() {
        this.isStarted = false;
    }
    /**
     * @method destroy 타입노드 해제 및 초기화
     */
    destroy() {
        this.pause();
        this.clear();
        this.element.innerHTML = this.element.typings[0];
        delete this.element['typings'];
        delete this.element['typozConfig'];
        this.typingList = [];
    }
    /* istanbul ignore next */
    wait(/** @default 0 */ time = 0) {
        return new Promise((resolve) => {
            if (this.stop) {
                this.play = resolve;
            }
            else {
                setTimeout(() => {
                    resolve(true);
                }, time * 1000);
            }
        });
    }
    /**
     * @method run 초기 렌더링 시작 메서드
     * @description 외부에서 호출하기위해 제작되었습니다.
     */
    /* istanbul ignore next */
    run() {
        this.isStarted = true;
        this.render();
    }
    /**
     * @private
     * @method renderEraseDivide divide모드 타이핑 지우기
     * @param {string[][]} eraseArray 지울 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    renderEraseDivide(eraseArray) {
        /* istanbul ignore next */
        return new Promise((resolve) => {
            const origin = [...this.element.innerText].map((t) => createEl('span', t).outerHTML);
            let pointer = origin.length;
            let word = eraseArray.pop();
            const eraseLoop = setInterval(async () => {
                if (this.stop) {
                    await this.wait();
                }
                if (word.length === 0) {
                    if (eraseArray.length === 0) {
                        clearInterval(eraseLoop);
                        this.element.innerText = '';
                        resolve(true);
                        return;
                    }
                    else {
                        word = eraseArray.pop();
                        pointer -= 1;
                    }
                    this.element.innerHTML = '';
                    this.element.innerHTML = origin.slice(0, pointer).join('');
                }
                else {
                    this.element.innerHTML = [
                        ...origin.slice(0, pointer - 1),
                        createEl('span', word.pop()).outerHTML,
                    ].join('');
                }
            }, (1 / this.config.speed.erase) * 100);
        });
    }
    /**
     * @private
     * @method renderWriteDivide divide모드로 타이핑 쓰기
     * @param {string[][]} writeArray 쓸 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    renderWriteDivide(writeArray) {
        /* istanbul ignore next */
        return new Promise((resolve) => {
            let pointer = 0;
            const change = [];
            let word = writeArray.shift();
            const writeLoop = setInterval(async () => {
                if (this.stop) {
                    await this.wait();
                }
                if (word.length === 0) {
                    if (writeArray.length === 0) {
                        clearInterval(writeLoop);
                        this.element.innerHTML = change.join('');
                        resolve(true);
                    }
                    else {
                        word = writeArray.shift();
                        pointer += 1;
                    }
                }
                else {
                    change[pointer] = createEl('span', word.shift()).outerHTML;
                    this.element.innerHTML = change.join('');
                }
            }, (1 / this.config.speed.write) * 100);
        });
    }
    /**
     * @method renderErase 일반 타이핑 지우기
     * @param {string[][]} eraseArray 지울 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    renderErase(eraseArray) {
        /* istanbul ignore next */
        return new Promise((resolve) => {
            let pointer = this.element.innerText.length;
            const origin = this.element.innerText;
            let word = eraseArray.pop();
            const eraseLoop = setInterval(async () => {
                if (this.stop) {
                    await this.wait();
                }
                if (word.length === 0) {
                    if (eraseArray.length === 0) {
                        clearInterval(eraseLoop);
                        this.element.innerText = '';
                        resolve(true);
                        return;
                    }
                    else {
                        word = eraseArray.pop();
                        pointer -= 1;
                    }
                    this.element.innerText = origin.slice(0, pointer);
                }
                else {
                    this.element.innerText = origin.slice(0, pointer - 1) + word.pop();
                }
            }, (1 / this.config.speed.erase) * 100);
        });
    }
    /**
     * @private
     * @method renderWrite 일반 타이핑 쓰기
     * @param {string[][]} writeArray 쓸 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    renderWrite(writeArray) {
        /* istanbul ignore next */
        return new Promise((resolve) => {
            let pointer = 0;
            const change = [];
            let word = writeArray.shift();
            const writeLoop = setInterval(async () => {
                if (this.stop) {
                    await this.wait();
                }
                if (word.length === 0) {
                    if (writeArray.length === 0) {
                        clearInterval(writeLoop);
                        this.element.innerText = change.join('');
                        resolve(true);
                    }
                    else {
                        word = writeArray.shift();
                        pointer += 1;
                    }
                }
                else {
                    change[pointer] = word.shift();
                    this.element.innerText = change.join('');
                }
            }, (1 / this.config.speed.write) * 100);
        });
    }
    /**
     * @async
     * @method render 타입노드 렌더링
     * @returns {Promise<void>} Returns promise
     */
    /* istanbul ignore next */
    async render() {
        if (this.isStarted === false)
            return;
        this.orderUp();
        if (this.config.mode.divide) {
            await this.renderWriteDivide([...this.copyCurrent()]);
            await this.wait(this.config.delay);
            if (this.config.mode.erase) {
                await this.renderEraseDivide([...this.copyCurrent()]);
                await this.wait(this.config.delay);
            }
        }
        else {
            await this.renderWrite([...this.copyCurrent()]);
            if (this.config.mode.erase) {
                await this.renderErase([...this.copyCurrent()]);
                await this.wait(this.config.delay);
            }
        }
        if (this.isStarted) {
            this.render();
        }
    }
}
//# sourceMappingURL=TypeNode.js.map