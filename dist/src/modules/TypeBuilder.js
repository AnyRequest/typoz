import { createEl, createName, findOne, getCursorStyle, initializeTypozStyle, recursiveConfigApply, } from '../utils/feature';
import { DEFAULT_CONFIG } from '../utils/global.instance';
export default class TypeBuilder {
    static instance(parser) {
        return new TypeBuilder(parser);
    }
    static id = 0;
    parser;
    id;
    name;
    config = DEFAULT_CONFIG;
    typeNode;
    taskQueue = [];
    pointer = 0;
    content = [];
    constructor(parser) {
        this.parser = parser;
    }
    wait(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(time);
            }, time);
        });
    }
    select(select) {
        const element = findOne(select);
        TypeBuilder.id += 1;
        this.id = TypeBuilder.id;
        this.typeNode = element;
        this.name = createName();
        return this;
    }
    conf(config = DEFAULT_CONFIG) {
        if (config)
            recursiveConfigApply(this.config, config);
        const style = getCursorStyle(this.config.style.cursor, this.name, true);
        initializeTypozStyle(style);
        this.typeNode.setAttribute('typoz-id', '' + this.id);
        this.typeNode.setAttribute('typoz-name', this.name);
        this.typeNode.setAttribute('typoz-node-builder', '');
        this.typeNode.setAttribute('typoz-processed', '');
        this.typeNode.innerHTML = '';
        return this;
    }
    getCurrentRenderContentLength() {
        return this.content.length;
    }
    cursorUpdate(value) {
        if (this.pointer + value >= 0 &&
            this.pointer + value <= this.content.length)
            this.pointer += value;
    }
    pause(sec) {
        this.addTask(async () => {
            return await this.wait(sec * 1000);
        });
        return this;
    }
    commonWrite(letter) {
        this.addTask(async () => {
            this.content = this.content
                .slice(0, this.pointer)
                .concat(letter)
                .concat(this.content.slice(this.pointer));
            // this.content.splice(this.pointer, 0, letter);
            this.cursorUpdate(1);
            this.renderContent();
            return await this.wait((1 / this.config.speed.write) * 100);
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
            return await this.wait((1 / this.config.speed.write) * 100);
        });
        return this;
    }
    replace(point, word) {
        this.addTask(async () => {
            this.content.splice(this.pointer, 1, word);
            this.cursorUpdate(point);
            this.renderContent();
            return await this.wait((1 / this.config.speed.write) * 100);
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
                            return await this.wait(speed ? (1 / speed) * 100 : (1 / this.config.speed.write) * 100);
                        });
                    }
                    else {
                        this.addTask(async () => {
                            this.content.splice(this.pointer, 1, letters);
                            this.renderContent();
                            return await this.wait(speed ? (1 / speed) * 100 : (1 / this.config.speed.write) * 100);
                        });
                    }
                }
                this.addTask(async () => {
                    this.cursorUpdate(1);
                    this.renderContent();
                    return await this.wait(speed ? (1 / speed) * 100 : (1 / this.config.speed.write) * 100);
                });
            }
            else {
                this.commonWrite(letter);
            }
        }
        return this;
    }
    erase(value = 1, speed) {
        for (let i = 0; i < value; i++) {
            this.addTask(async () => {
                this.cursorUpdate(-1);
                this.content.splice(this.pointer, 1);
                this.renderContent();
                return await this.wait(speed ? (1 / speed) * 100 : (1 / (this.config.speed.erase / 2)) * 100);
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
                    : (1 / (this.config.speed.erase / 2) / 5) * 100);
            }
            return speed
                ? (1 / (speed / 2) / 5) * 100
                : (1 / (this.config.speed.erase / 2) / 5) * 100;
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
                return await this.wait(speed ? (1 / speed) * 100 : this.config.delay * 100);
            });
        }
        return this;
    }
    addTask(task) {
        this.taskQueue.push(task);
    }
    async run() {
        for (const task of this.taskQueue) {
            await task();
        }
    }
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
}
//# sourceMappingURL=TypeBuilder.js.map