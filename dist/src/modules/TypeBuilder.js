import { createEl, createName, deprecatedMessage, findOne, getCursorStyle, initializeTypozStyle, recursiveConfigApply, } from '../utils/feature.js';
import { DEFAULT_CONFIG } from '../utils/global.instance.js';
export default class TypeBuilder {
    /**
     * @static
     * @method instance 타입빌더 인스턴스
     * @param parser 텍스트 분석기
     * @returns {TypeBuilder} 타입빌더 반환
     */
    static instance(parser) {
        return new TypeBuilder(parser);
    }
    /**
     * @static
     * @property {number} id 타입빌더 auto increment id
     */
    static id = 0;
    /**
     * @private
     * @property {Parser} parser 텍스트 분석기
     */
    parser;
    /** @property {number} id 타입빌더 고유 id */
    id;
    /** @property {string} name 타입빌더 고유 랜덤 네임 */
    name;
    /** @property {OmitNodesOptions} config 타입빌더 설정 */
    _config = DEFAULT_CONFIG;
    /**
     * @property {HTMLTypozElement} typeNode 타입빌더 지정 요소
     */
    typeNode;
    /**
     * @private
     * @property {string} originContent 타입빌더 지정 요소의 원본 텍스트
     */
    originContent;
    /** @property {Task[]} taskQueue 빌더의 작업 배열 */
    taskQueue = [];
    /** @property {number} pointer 커서의 위치 인덱스 */
    pointer = 0;
    /** @property {string[]} content 타입빌더 출력 배열 */
    content = [];
    /**
     * @property {boolean} stop destroy 호출 시 true로 변경
     * @default false
     */
    stop = false;
    /**
     * @private
     * @property {boolean} pauseRender 일시정지 시그널
     */
    pauseSignal = false;
    /**
     * @private
     * @property {Function} resumeResolver 재개 활성화 리졸버
     */
    resumeResolver;
    /**
     * @private
     * @property {Promise<boolean>} pausePromise 일시정지 펜딩 변수
     */
    pausePromise;
    constructor(parser) {
        this.parser = parser;
    }
    /**
     * @method pauseRender 렌더링 일시정지
     * @since 0.1.0
     * @example
     * window.addEventListener("click", () => {
     *  if(toggle) {
     *    // resume render
     *    typoz.typeBuilderNodes[0]?.resumeRender();
     *  } else {
     *    // pause render
     *    typoz.typeBuilderNodes[0]?.pauseRender();
     *  }
     * });
     */
    pauseRender() {
        this.pauseSignal = true;
        this.pausePromise = new Promise((resolve) => {
            this.resumeResolver = resolve;
        });
    }
    /**
     * @method resumeRender 렌더링 재개
     * @since 0.1.0
     * @see pauseRender
     */
    resumeRender() {
        this.resumeResolver(true);
        this.pauseSignal = false;
        this.resumeResolver = undefined;
        this.pausePromise = undefined;
    }
    /**
     * @private
     * @method wait 비동기 대기 메서드
     * @param {number} time 대기 시간
     * @returns {Promise<number>}
     */
    wait(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(time);
            }, time);
        });
    }
    /**
     * @method select 노드 선택 메서드
     * @param select 노드의 id 또는 class 선택자
     * @example
     * typoz.node().select("#target1");
     * typoz.node().select(".my-typoz-target");
     * @returns {TypeBuilder} Returns a TypeBuilder
     */
    select(select) {
        const element = findOne(select);
        TypeBuilder.id += 1;
        this.id = TypeBuilder.id;
        this.typeNode = element;
        this.originContent = element.innerHTML;
        this.name = createName();
        return this;
    }
    conf(config = DEFAULT_CONFIG) {
        deprecatedMessage('0.0.19', 'config');
        if (config)
            recursiveConfigApply(this._config, config);
        const style = getCursorStyle(this._config.style.cursor, this.name, true);
        initializeTypozStyle(style);
        this.typeNode.setAttribute('typoz-node-builder-id', '' + this.id);
        this.typeNode.setAttribute('typoz-node-builder-name', this.name);
        this.typeNode.setAttribute('typoz-node-builder', '');
        this.typeNode.setAttribute('typoz-processed', '');
        this.typeNode.innerHTML = '';
        return this;
    }
    config(config = DEFAULT_CONFIG) {
        if (config)
            recursiveConfigApply(this._config, config);
        const style = getCursorStyle(this._config.style.cursor, this.name, true);
        initializeTypozStyle(style);
        this.typeNode.setAttribute('typoz-node-builder-id', '' + this.id);
        this.typeNode.setAttribute('typoz-node-builder-name', this.name);
        this.typeNode.setAttribute('typoz-node-builder', '');
        this.typeNode.setAttribute('typoz-processed', '');
        this.typeNode.innerHTML = '';
        return this;
    }
    /**
     * @deprecated since version 0.0.19
     * @private
     * @method getCurrentRenderContentLength
     * @returns {number} Returns the number of current render content
     */
    getCurrentRenderContentLength() {
        deprecatedMessage('0.0.19');
        return this.content.length;
    }
    /**
     * @private
     * @method cursorUpdate 커서 위치 업데이트
     * @param {number} value 커서 위치 인덱스
     */
    cursorUpdate(value) {
        if (this.pointer + value >= 0 &&
            this.pointer + value <= this.content.length)
            this.pointer += value;
    }
    /**
     * @method pause 타이핑 일시정지 메서드
     * @param {number} sec 휴식 시간
     * @returns {TypeBuilder} Returns a TypeBuilder
     */
    pause(sec) {
        this.addTask(async () => {
            return await this.wait(sec * 1000);
        });
        return this;
    }
    /**
     * @private
     * @method commonWrite 한글 외 단어 쓰기
     * @param {string} letter 한글 외 단어
     */
    commonWrite(letter) {
        this.addTask(async () => {
            this.content = this.content
                .slice(0, this.pointer)
                .concat(letter)
                .concat(this.content.slice(this.pointer));
            // this.content.splice(this.pointer, 0, letter);
            this.cursorUpdate(1);
            this.renderContent();
            return await this.wait((1 / this._config.speed.write) * 100);
        });
    }
    addplace(point, word) {
        this.addTask(async () => {
            this.content = this.content
                .slice(0, this.pointer)
                .concat(word)
                .concat(this.content.slice(this.pointer));
            this.cursorUpdate(point);
            this.renderContent();
            return await this.wait((1 / this._config.speed.write) * 100);
        });
        return this;
    }
    replace(point, word) {
        this.addTask(async () => {
            this.content.splice(this.pointer, 1, word);
            this.cursorUpdate(point);
            this.renderContent();
            return await this.wait((1 / this._config.speed.write) * 100);
        });
        return this;
    }
    write(word, speed) {
        for (const letter of word) {
            if (this.parser.koreanParser.isKorean(letter)) {
                const parsedKoreanLetter = this.parser.categorizing(letter);
                const typingFlows = this.parser.getTypingFlow(parsedKoreanLetter)[0];
                for (let i = 0; i < typingFlows.length; i++) {
                    const letters = typingFlows[i];
                    if (i === 0) {
                        this.addTask(async () => {
                            this.content = this.content
                                .slice(0, this.pointer)
                                .concat(letters)
                                .concat(this.content.slice(this.pointer));
                            this.renderContent();
                            return await this.wait(speed
                                ? (1 / speed) * 100
                                : (1 / this._config.speed.write) * 100);
                        });
                    }
                    else {
                        this.addTask(async () => {
                            this.content.splice(this.pointer, 1, letters);
                            this.renderContent();
                            return await this.wait(speed
                                ? (1 / speed) * 100
                                : (1 / this._config.speed.write) * 100);
                        });
                    }
                }
                this.addTask(async () => {
                    this.cursorUpdate(1);
                    this.renderContent();
                    return await this.wait(speed ? (1 / speed) * 100 : (1 / this._config.speed.write) * 100);
                });
            }
            else {
                this.commonWrite(letter);
            }
        }
        return this;
    }
    erase(/** @default 1 */ value = 1, speed) {
        for (let i = 0; i < value; i++) {
            this.addTask(async () => {
                this.cursorUpdate(-1);
                this.content.splice(this.pointer, 1);
                this.renderContent();
                return await this.wait(speed
                    ? (1 / speed) * 100
                    : (1 / (this._config.speed.erase / 2)) * 100);
            });
        }
        return this;
    }
    allErase(speed) {
        this.addTask(async () => {
            while (this.content.length > 0) {
                this.cursorUpdate(-1);
                this.content.pop();
                this.renderContent();
                await this.wait(speed
                    ? (1 / (speed / 2) / 5) * 100
                    : (1 / (this._config.speed.erase / 2) / 5) * 100);
            }
            return speed
                ? (1 / (speed / 2) / 5) * 100
                : (1 / (this._config.speed.erase / 2) / 5) * 100;
        });
        return this;
    }
    move(value, speed) {
        const abs = Math.abs(value);
        const amount = Math.floor(Math.abs(value) / value);
        for (let i = 0; i < abs; i++) {
            this.addTask(async () => {
                this.cursorUpdate(amount);
                this.renderContent();
                return await this.wait(speed ? (1 / speed) * 100 : this._config.delay * 100);
            });
        }
        return this;
    }
    /**
     * @private
     * @method addTask 작업 추가
     * @param task 타입빌더 작업 함수
     */
    addTask(task) {
        this.taskQueue.push(task);
    }
    /**
     * @async
     * @method run 렌더링을 1회 실행
     * @description 렌더링 후 정지합니다.
     */
    async run() {
        for (const task of this.taskQueue) {
            if (this.stop) {
                break;
            }
            if (this.pauseSignal) {
                await this.pausePromise;
            }
            await task();
        }
    }
    async forever(
    /** @default false */ skipErase = false) {
        for (const task of this.taskQueue) {
            if (this.stop) {
                return;
            }
            if (this.pauseSignal) {
                await this.pausePromise;
            }
            await task();
        }
        await this.wait(this._config.delay * 1000);
        if (skipErase) {
            this.pointer = 0;
            this.content = [];
            this.renderContent();
        }
        else {
            while (this.content.length > 0) {
                this.cursorUpdate(-1);
                this.content.pop();
                this.renderContent();
                await this.wait((1 / (this._config.speed.erase / 2) / 5) * 100);
            }
            await this.wait(this._config.delay * 1000);
        }
        this.forever(skipErase);
    }
    /**
     * @private
     * @method renderContent content에 담긴 텍스트 렌더링
     * See {@link TypeBuilder.content}
     */
    renderContent() {
        this.typeNode.innerHTML = this.content
            .map((_, __) => createEl('span', _, __ === this.pointer - 1
            ? {
                name: 'typoz-cursor',
                value: '',
            }
            : undefined).outerHTML)
            .join('');
    }
    /**
     * @method destroy 타입빌더 해제 및 초기화
     */
    destroy() {
        this.stop = true;
        this.taskQueue = [];
        this.typeNode.innerHTML = this.originContent;
        delete this.typeNode['typings'];
        delete this.typeNode['typozConfig'];
    }
}
//# sourceMappingURL=TypeBuilder.js.map