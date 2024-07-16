/**
 * @version 0.1.2
 */
import TypeNode from '../models/TypeNode.js';
import Parser from '../modules/Parser.js';
import { copyConfig, deprecatedMessage, findElements, findOne, getCursorStyle, initializeTypozStyle, recursiveConfigApply, trimInnerText, } from '../utils/feature.js';
import TypeBuilder from '../modules/TypeBuilder.js';
import { DEFAULT_CONFIG } from '../utils/global.instance.js';
import Util from '../libs/utils.js';
import { version } from '../common/variables.js';
export class Typoz {
    /**
     * @private
     * @readonly
     * @property {Options} defaultConfig 기본 타이핑 설정
     */
    defaultConfig = DEFAULT_CONFIG;
    /**
     * @private
     * @property {Parser} parser 텍스트 분석기
     */
    parser;
    util;
    static version() {
        return version;
    }
    /**
     * @method createBuilder 타입빌더 인스턴스 호출 메서드
     * @description 빌더는 파서를 확장하여 사용됩니다.
     * @returns {TypeBuilder} 타입빌더를 반환합니다.
     * @example
     * const typoz = new Typoz();
     * // select 및 config는 필수로 호출되어야 합니다.
     * // config가 호출되지 않으면 오류가 발생 할 수 있습니다.
     * typoz.createBuilder().select("#target").config().write("hello").run();
     * // or
     * typoz.createBuilder().select("#target").config({
     *   speed: { write: 1 },
     * }).write("hello").run();
     */
    createBuilder() {
        const builder = TypeBuilder.instance(this.parser);
        this.typeBuilderNodes.push(builder);
        return builder;
    }
    /**
     * @deprecated since version 0.1.0 - use createBuilder
     * @method node 타입빌더 인스턴스 호출 메서드
     * @description 빌더는 파서를 확장하여 사용됩니다.
     * @returns {TypeBuilder} 타입빌더를 반환합니다.
     * @example
     * const typoz = new Typoz();
     * // select 및 config는 필수로 호출되어야 합니다.
     * // config가 호출되지 않으면 오류가 발생 할 수 있습니다.
     * typoz.node().select("#target").config().write("hello").run();
     * // or
     * typoz.node().select("#target").config({
     *   speed: { write: 1 },
     * }).write("hello").run();
     */
    node() {
        deprecatedMessage('0.1.0', 'createBuilder');
        const builder = TypeBuilder.instance(this.parser);
        this.typeBuilderNodes.push(builder);
        return builder;
    }
    /** @property {Options} config 타이핑 설정 */
    config;
    /** @property {TypNode[]} typNodes 타입 노드 배열 */
    typeNodes = [];
    typeBuilderNodes = [];
    constructor() {
        this.parser = new Parser();
        this.util = new Util(this.parser);
    }
    /**
     * @method initialize typoz 사용에서 항상 필수로 먼저 실행되어야 합니다.
     */
    initialize() {
        this.config = copyConfig(this.defaultConfig);
        // this.parser = new Parser();
    }
    /**
     * @method destroy typoz 설정 해제 및 초기화
     * @description typoz에 등록된 모든 노드를 정지, 제거합니다. 다시 시작하려면 initialize와 globalConfig를 호출해야합니다.
     */
    destroy() {
        this.config = copyConfig(this.defaultConfig);
        TypeNode.id = 0;
        TypeBuilder.id = 0;
        for (const typeNode of this.typeNodes) {
            typeNode.destroy();
        }
        for (const builder of this.typeBuilderNodes) {
            builder.destroy();
        }
        this.typeNodes = [];
        this.typeBuilderNodes = [];
        document.head.querySelectorAll('[typoz-styles]').forEach((style) => {
            style?.remove?.();
        });
    }
    /**
     * @method globalConfig typoz의 모든 노드에 기본 적용되는 환경설정을 합니다.
     * @param {RecursivePartial<Options>} customConfigs 전역 환경 설정
     * @description globalConfig를 호출하면 자동으로 render메서드가 호출됩니다. autoRender가 false면 render메서드를 원하는 시점에서 호출해야합니다.
     *
     */
    globalConfig(customConfigs = DEFAULT_CONFIG) {
        if (customConfigs)
            recursiveConfigApply(this.config, customConfigs);
        if (this.config.autoRender) {
            this.render();
        }
    }
    /**
     * @method convert 단어 단위 문장 분해
     * @param {string} sentences 텍스트 타이핑을 위해 분해할 문장
     * @returns {string[][]} 분해된 단어 묶음 (2차 배열)
     */
    convert(sentences) {
        return this.parser.parse(sentences);
    }
    /**
     * @method bulkConvert 단어 단위 배열 문장 분해
     * @param sentences 텍스트 타이핑을 위해 분해할 문장 배열
     * @returns {string[][]} 분해된 단어 묶음 (3차 배열)
     */
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
            /* typing node control */
            const typing = this.typeNodes.find((typing) => typing.name === name);
            if (typing) {
                typing.resume();
            }
            /* builder control */
            const builder = this.typeBuilderNodes.find((builder) => builder.name === name);
            if (builder) {
                builder.resumeRender();
            }
        }
        else {
            /* typing node control */
            for (const typing of this.typeNodes) {
                typing.resume();
            }
            /* builder control */
            for (const builder of this.typeBuilderNodes) {
                builder.resumeRender();
            }
        }
    }
    pause(name) {
        /* istanbul ignore next */
        if (name !== null && name !== undefined && typeof name === 'string') {
            /* typing node control */
            const typing = this.typeNodes.find((typing) => typing.name === name);
            if (typing) {
                typing.pause();
            }
            /* builder control */
            const builder = this.typeBuilderNodes.find((builder) => builder.name === name);
            if (builder) {
                builder.resumeRender();
            }
        }
        else {
            /* typing node control */
            for (const typing of this.typeNodes) {
                typing.pause();
            }
            /* builder control */
            for (const builder of this.typeBuilderNodes) {
                builder.pauseRender();
            }
        }
    }
    /**
     * @private
     * @method defaultRender 기본 요소 렌더링 준비
     */
    defaultRender() {
        const defaultElements = findElements(this.config.querySelector);
        for (const element of [...new Set(defaultElements)]) {
            // console.log('insert', element, element.typings);
            const trimText = element.innerText.trim();
            let typings = [];
            if (!Object.hasOwn(element, 'typings')) {
                element.typings = [];
            }
            if (trimText) {
                element.typings.push(trimText);
                // console.log(element.typings);
                const converted = this.convert(trimText);
                typings.push(converted);
            }
            // console.log(typings);
            const typingModel = new TypeNode(element, element.typozConfig || JSON.parse(JSON.stringify(this.config)), typings);
            this.typeNodes.push(typingModel);
        }
    }
    /**
     * @private
     * @method manualRender 수동 추가된 요소 렌더링 준비
     * See {@link Typoz.render} argument
     */
    manualRender(elements) {
        for (const element of [...new Set(elements)]) {
            const trimText = element.innerText.trim();
            let typings = [];
            if (!Object.hasOwn(element, 'typings')) {
                element.typings = [];
            }
            if (trimText !== '') {
                element.typings.push(trimText);
                const converted = this.convert(trimText);
                typings.push(converted);
            }
            const typingModel = new TypeNode(element, element.typozConfig || JSON.parse(JSON.stringify(this.config)), typings);
            this.typeNodes.push(typingModel);
        }
    }
    /**
     * @private
     * @method getConfigNodes config에 추가된 nodes 요소 탐색
     */
    getConfigNodes() {
        if (this.config.nodes.length > 0) {
            return this.config.nodes.reduce((acc, { select, words, config }) => {
                const target = findOne(select);
                // console.log('insert', target, target.typings);
                const defaultQuerySelector = this.config.querySelector instanceof Array
                    ? this.config.querySelector[0]
                    : this.config.querySelector;
                /* istanbul ignore next */
                if (target && !target.classList.contains(defaultQuerySelector)) {
                    if (!Object.hasOwn(target, 'typozConfig')) {
                        const copy = JSON.parse(JSON.stringify(this.config));
                        recursiveConfigApply(copy, config || this.config);
                        target.typozConfig = copy;
                    }
                    const targetText = trimInnerText(target);
                    if (!Object.hasOwn(target, 'typings')) {
                        target.typings = [];
                        if (targetText) {
                            target.typings.push(targetText);
                        }
                    }
                    if (words?.length > 0) {
                        target.typings.push(...words.map((_) => _.trim()));
                    }
                    acc.push(target);
                }
                else {
                    /* istanbul ignore next */
                    console.error(new SyntaxError('not found element. select: ' + select, {
                        cause: select,
                    }));
                }
                return acc;
            }, []);
        }
        return [];
    }
    /**
     * @private
     * @method nodesRender nodes 요소 렌더링 준비
     */
    nodesRender() {
        const nodesElements = this.getConfigNodes();
        for (const element of [...new Set(nodesElements)]) {
            const parseBaseText = element.innerText.trim();
            const parsedSentences = [];
            if (parseBaseText) {
                parsedSentences.push(parseBaseText);
            }
            if (element.typings?.length > 0) {
                parsedSentences.push(...element.typings);
                // console.log(element, element.typings);
            }
            const typingModel = new TypeNode(element, element.typozConfig || JSON.parse(JSON.stringify(this.defaultConfig)), this.bulkConvert([...new Set(parsedSentences)]));
            if (!this.typeNodes.includes(typingModel)) {
                this.typeNodes.push(typingModel);
            }
        }
    }
    render(elements) {
        let styles = '@keyframes cursor-blink { 100% { opacity: 0; } }';
        styles += getCursorStyle(this.config.style.cursor);
        this.defaultRender();
        if (elements) {
            this.manualRender(elements);
        }
        this.nodesRender();
        for (const typing of this.typeNodes) {
            styles += typing.injectStyle + '\n';
            typing.run();
        }
        initializeTypozStyle(styles);
    }
}
//# sourceMappingURL=Typoz.js.map