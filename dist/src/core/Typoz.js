import Typing from '../models/Typing';
import Parser from '../modules/Parser';
import DomManager from '../plugins/DomManager';
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
    domManager;
    config;
    typingList = [];
    constructor() {
        this.parser = new Parser();
        this.domManager = new DomManager();
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
            return this.config.nodes.reduce((acc, { select, words, config }) => {
                const target = this.domManager.findOne(select);
                /* istanbul ignore next */
                if (target) {
                    if (!Object.hasOwn(target, 'typozConfig')) {
                        const copy = JSON.parse(JSON.stringify(this.defaultConfig));
                        console.log('copy', copy);
                        this.recursiveConfigApply(copy, config || this.config);
                        target.typozConfig = copy;
                    }
                    const targetText = this.domManager.trimInnerText(target);
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
                    /* istanbul ignore next */
                    console.error(new SyntaxError('not found element.', { cause: select }));
                }
                return acc;
            }, []);
        }
        return [];
    }
    resume(name) {
        /* istanbul ignore next */
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
        /* istanbul ignore next */
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
        /* istanbul ignore next */
        if (elements) {
            /* istanbul ignore next */
            if (elements instanceof Array) {
                temp.push(...elements);
            }
            else {
                temp.push(elements);
            }
        }
        else {
            const defaultElements = this.domManager.findElements(this.config.querySelector);
            temp.push(...defaultElements);
        }
        temp.push(...this.getConfigNodes());
        for (const element of [...new Set(temp)]) {
            // if(this.config.nodes)
            const id = ++increaseId;
            const parseBaseText = this.convert(element.innerText.trim());
            const parsedSentences = [parseBaseText];
            if (element.typings?.length > 0) {
                parsedSentences.push(...element.typings);
            }
            const typingModel = new Typing(id, element, element.typozConfig || JSON.parse(JSON.stringify(this.defaultConfig)), parsedSentences);
            styles += typingModel.injectStyle + '\n';
            this.typingList.push(typingModel);
            typingModel.run();
        }
        this.domManager.initializeTypozStyle(styles);
    }
}
//# sourceMappingURL=Typoz.js.map