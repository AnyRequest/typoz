import Typing from '../models/Typing';
import Parser from '../modules/Parser';
export class Typoz {
    defaultConfig = {
        autoRender: true,
        mode: {
            erase: true,
            realTyping: false,
            divide: true,
        },
        speed: {
            write: 1,
            erase: 1,
        },
        delay: 5,
        nodes: [],
        querySelector: '.typoz',
    };
    parser;
    config;
    typingList = [];
    constructor() {
        this.parser = new Parser();
    }
    recursiveConfigApply(config, customConfigs) {
        for (const key of Object.keys(customConfigs)) {
            if (typeof config[key] !== 'string' &&
                typeof config[key] !== 'number' &&
                typeof config[key] !== 'boolean' &&
                !(config[key] instanceof Array)) {
                this.recursiveConfigApply(config[key], customConfigs[key]);
            }
            else {
                config[key] = customConfigs[key];
            }
        }
    }
    findElements() {
        return document.querySelectorAll([].concat(this.config.querySelector).join(','));
    }
    initialize() {
        this.config = this.defaultConfig;
    }
    globalConfig(customConfigs = {
        autoRender: true,
        mode: {
            erase: true,
            realTyping: false,
            divide: true,
        },
        speed: {
            write: 1,
            erase: 1,
        },
        delay: 5,
        nodes: [],
        querySelector: '.typoz',
    }) {
        if (customConfigs)
            this.recursiveConfigApply(this.config, customConfigs);
        if (this.config.autoRender) {
            this.render();
        }
    }
    convert(sentences) {
        return this.parser.parse(sentences);
    }
    bulkConvert(sentences) {
        const temp = [];
        for (const sentence of sentences) {
            temp.push(this.convert(sentence));
        }
        return temp;
    }
    getConfigNodes() {
        if (this.config.nodes.length > 0) {
            return this.config.nodes.reduce((acc, { select, words }) => {
                const target = document.querySelector(select);
                if (target) {
                    const targetText = target.innerText.trim();
                    if (targetText !== '') {
                        if (!Object.hasOwn(target, 'typings')) {
                            target.typings = [];
                        }
                        target.typings.push(this.convert(targetText));
                        if (words.length > 0) {
                            target.typings.push(...this.bulkConvert(words));
                        }
                        acc.push(target);
                    }
                }
                else {
                    console.error(new SyntaxError('not found element.', { cause: select }));
                }
                return acc;
            }, []);
        }
        return [];
    }
    resume(name) {
        if (name !== null && name !== undefined && typeof name === 'string') {
            const typing = this.typingList.find((typing) => typing.name === name);
            if (typing) {
                typing.resume();
            }
        }
        else {
            for (const typing of this.typingList) {
                typing.resume();
            }
        }
    }
    pause(name) {
        if (name !== null && name !== undefined && typeof name === 'string') {
            const typing = this.typingList.find((typing) => typing.name === name);
            if (typing) {
                typing.pause();
            }
        }
        else {
            for (const typing of this.typingList) {
                typing.pause();
            }
        }
    }
    render(elements) {
        const temp = [];
        let styles = '';
        let increaseId = 0;
        if (elements) {
            if (elements instanceof Array) {
                temp.push(...elements);
            }
            else {
                temp.push(elements);
            }
        }
        else {
            const defaultElements = this.findElements();
            temp.push(...defaultElements);
        }
        temp.push(...this.getConfigNodes());
        for (const element of [...new Set(temp)]) {
            const id = ++increaseId;
            const parseBaseText = this.convert(element.innerText.trim());
            const parsedSentences = [parseBaseText];
            if (element.typings?.length > 0) {
                parsedSentences.push(...element.typings);
            }
            const typingModel = new Typing(id, element, JSON.parse(JSON.stringify(this.config)), parsedSentences);
            styles += typingModel.injectStyle + '\n';
            this.typingList.push(typingModel);
            typingModel.run();
        }
        const typozDefaultStyle = document.createElement('style');
        typozDefaultStyle.innerText = styles;
        document.head.append(typozDefaultStyle);
    }
}
//# sourceMappingURL=Typoz.js.map