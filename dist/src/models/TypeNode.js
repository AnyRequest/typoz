import { createEl, createName, getCursorStyle } from '../utils/feature';
export default class TypeNode {
    static id = 0;
    id;
    name;
    typingList = [];
    config;
    before = 0;
    element;
    isStarted = false;
    injectStyle;
    order = 0;
    stop = false;
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
    orderUp() {
        this.order = (this.order + 1) % this.typingList.length || 0;
    }
    setup() {
        Object.freeze(this.typingList);
        Object.freeze(this.config);
        this.element.innerHTML = '';
        this.element.setAttribute('typoz-id', '' + this.id);
        this.element.setAttribute('typoz-name', this.name);
        this.element.setAttribute('typoz-processed', '');
        this.injectStyle = getCursorStyle(this.config.style.cursor, this.name);
    }
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
    /* istanbul ignore next */
    resume() {
        this.play(true);
        this.stop = false;
    }
    /* istanbul ignore next */
    pause() {
        this.stop = true;
    }
    /* istanbul ignore next */
    clear() {
        this.isStarted = false;
    }
    destroy() {
        this.pause();
        this.clear();
        this.element.innerHTML = this.element.typings[0];
        this.typingList = [];
    }
    /* istanbul ignore next */
    wait(time = 0) {
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
    /* istanbul ignore next */
    run() {
        this.isStarted = true;
        this.render();
    }
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