import TypeNode from '../models/TypeNode';
import Parser from '../modules/Parser';
import { copyConfig, findElements, findOne, getCursorStyle, initializeTypozStyle, recursiveConfigApply, trimInnerText, } from '../utils/feature';
import TypeBuilder from '../modules/TypeBuilder';
import { DEFAULT_CONFIG } from '../utils/global.instance';
export class Typoz {
    defaultConfig = DEFAULT_CONFIG;
    parser;
    /**
     * 빌더는 파서를 확장하여 사용됩니다.
     * @returns {TypeBuilder} 타입빌더를 반환합니다.
     */
    node() {
        return TypeBuilder.instance(this.parser);
    }
    // private domManager: DomManager;
    config;
    typeNodes = [];
    constructor() {
        this.parser = new Parser();
        // this.domManager = new DomManager();
    }
    /**
     * @method initialize typoz 사용에서 항상 필수로 먼저 실행되어야 합니다.
     */
    initialize() {
        this.config = copyConfig(this.defaultConfig);
    }
    /**
     * @method destroy
     * SPA환경에서 hmr를 고려하여 에러를 우회하기 위해 typoz를 파괴합니다.
     * 다시 시작하려면 initialize와 globalConfig를 호출해야합니다.
     */
    destroy() {
        this.config = copyConfig(this.defaultConfig);
        TypeNode.id = 0;
        TypeBuilder.id = 0;
        for (const typing of this.typeNodes) {
            typing.destroy();
        }
        this.typeNodes = [];
    }
    /**
     * @method globalConfig typoz의 모든 노드에 기본 적용되는 환경설정을 합니다.
     * @param {RecursivePartial<Options>} customConfigs 전역 환경 설정
     * globalConfig를 호출하면 자동으로 render메서드가 호출됩니다. autoRender가 false면 render메서드를 원하는 시점에서 호출해야합니다. autoRender의 기본 값은 true입니다.
     *
     */
    globalConfig(customConfigs = DEFAULT_CONFIG) {
        if (customConfigs)
            recursiveConfigApply(this.config, customConfigs);
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
    resume(name) {
        /* istanbul ignore next */
        if (name !== null && name !== undefined && typeof name === 'string') {
            const typing = this.typeNodes.find((typing) => typing.name === name);
            if (typing) {
                typing.resume();
            }
        }
        else {
            for (const typing of this.typeNodes) {
                typing.resume();
            }
        }
    }
    pause(name) {
        /* istanbul ignore next */
        if (name !== null && name !== undefined && typeof name === 'string') {
            const typing = this.typeNodes.find((typing) => typing.name === name);
            if (typing) {
                typing.pause();
            }
        }
        else {
            for (const typing of this.typeNodes) {
                typing.pause();
            }
        }
    }
    defaultRender() {
        const defaultElements = findElements(this.config.querySelector);
        for (const element of [...new Set(defaultElements)]) {
            const trimText = element.innerText.trim();
            if (trimText !== '') {
                if (!Object.hasOwn(element, 'typings')) {
                    element.typings = [];
                }
                element.typings.push(trimText.trim());
            }
            const converted = this.convert(trimText);
            const typingModel = new TypeNode(element, element.typozConfig || JSON.parse(JSON.stringify(this.defaultConfig)), [converted]);
            this.typeNodes.push(typingModel);
        }
    }
    manualRender(elements) {
        for (const element of [...new Set(elements)]) {
            const trimText = element.innerText.trim();
            if (trimText !== '') {
                if (!Object.hasOwn(element, 'typings')) {
                    element.typings = [];
                }
                element.typings.push(trimText.trim());
            }
            const converted = this.convert(trimText);
            const typingModel = new TypeNode(element, element.typozConfig || JSON.parse(JSON.stringify(this.defaultConfig)), [converted]);
            this.typeNodes.push(typingModel);
        }
    }
    getConfigNodes() {
        if (this.config.nodes.length > 0) {
            return this.config.nodes.reduce((acc, { select, words, config }) => {
                const target = findOne(select);
                /* istanbul ignore next */
                if (target) {
                    target.setAttribute;
                    if (!Object.hasOwn(target, 'typozConfig')) {
                        const copy = JSON.parse(JSON.stringify(this.defaultConfig));
                        recursiveConfigApply(copy, config || this.config);
                        target.typozConfig = copy;
                    }
                    const targetText = trimInnerText(target);
                    if (targetText !== '') {
                        if (!Object.hasOwn(target, 'typings')) {
                            target.typings = [];
                        }
                        target.typings.push(targetText.trim());
                    }
                    if (words?.length > 0) {
                        target.typings.push(...words.map((_) => _.trim()));
                    }
                    acc.push(target);
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
    nodesRender() {
        const nodesElements = this.getConfigNodes();
        for (const element of [...new Set(nodesElements)]) {
            const parseBaseText = element.innerText.trim();
            const parsedSentences = [parseBaseText];
            if (element.typings?.length > 0) {
                parsedSentences.push(...element.typings);
            }
            const typingModel = new TypeNode(element, element.typozConfig || JSON.parse(JSON.stringify(this.defaultConfig)), this.bulkConvert([...new Set(parsedSentences)]));
            if (!this.typeNodes.includes(typingModel)) {
                this.typeNodes.push(typingModel);
            }
        }
    }
    render(elements) {
        let styles = '';
        styles += getCursorStyle(this.config.style.cursor);
        this.defaultRender();
        this.manualRender(elements);
        this.nodesRender();
        for (const typing of this.typeNodes) {
            styles += typing.injectStyle + '\n';
            typing.run();
        }
        initializeTypozStyle(styles);
    }
}
//# sourceMappingURL=Typoz.js.map