/**
 * @version 0.1.0
 */
import TypeNode from '../models/TypeNode.js';
import type { HTMLTypozElement, Options, RecursivePartial } from '../index.js';
import TypeBuilder from '../modules/TypeBuilder.js';
export declare class Typoz {
    /**
     * @private
     * @readonly
     * @property {Options} defaultConfig 기본 타이핑 설정
     */
    private readonly defaultConfig;
    /**
     * @private
     * @property {Parser} parser 텍스트 분석기
     */
    private parser;
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
    createBuilder(): TypeBuilder;
    /**
     * @deprecated since version 0.1.0
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
    node(): TypeBuilder;
    /** @property {Options} config 타이핑 설정 */
    config: Options;
    /** @property {TypNode[]} typNodes 타입 노드 배열 */
    typeNodes: TypeNode[];
    typeBuilderNodes: TypeBuilder[];
    constructor();
    /**
     * @method initialize typoz 사용에서 항상 필수로 먼저 실행되어야 합니다.
     */
    initialize(): void;
    /**
     * @method destroy typoz 설정 해제 및 초기화
     * @description typoz에 등록된 모든 노드를 정지, 제거합니다. 다시 시작하려면 initialize와 globalConfig를 호출해야합니다.
     */
    destroy(): void;
    /**
     * @method globalConfig typoz의 모든 노드에 기본 적용되는 환경설정을 합니다.
     * @param {RecursivePartial<Options>} customConfigs 전역 환경 설정
     * @description globalConfig를 호출하면 자동으로 render메서드가 호출됩니다. autoRender가 false면 render메서드를 원하는 시점에서 호출해야합니다.
     *
     */
    globalConfig(customConfigs?: RecursivePartial<Options>): void;
    /**
     * @method convert 단어 단위 문장 분해
     * @param {string} sentences 텍스트 타이핑을 위해 분해할 문장
     * @returns {string[][]} 분해된 단어 묶음 (2차 배열)
     */
    convert(sentences: string): string[][];
    /**
     * @method bulkConvert 단어 단위 배열 문장 분해
     * @param sentences 텍스트 타이핑을 위해 분해할 문장 배열
     * @returns {string[][]} 분해된 단어 묶음 (3차 배열)
     */
    bulkConvert(sentences: string[]): string[][][];
    /**
     * @method resume 렌더링 재개
     * @description 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 다시 진행합니다.
     */
    resume(): void;
    /**
     * @method resume 렌더링 재개
     * @param {string} [name] 등록된 노드를 대상으로 타이핑을 다시 진행합니다.
     * @description 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 다시 진행합니다.
     */
    resume(name: string): void;
    /**
     * @method pause 렌더링 일시정지
     * 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 중단합니다.
     */
    pause(): void;
    /**
     * @method pause 렌더링 일시정지
     * @param {string} [name] 등록된 노드를 대상으로 타이핑을 중단합니다.
     * 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 중단합니다.
     */
    pause(name: string): void;
    /**
     * @private
     * @method defaultRender 기본 요소 렌더링 준비
     */
    private defaultRender;
    /**
     * @private
     * @method manualRender 수동 추가된 요소 렌더링 준비
     * See {@link Typoz.render} argument
     */
    private manualRender;
    /**
     * @private
     * @method getConfigNodes config에 추가된 nodes 요소 탐색
     */
    private getConfigNodes;
    /**
     * @private
     * @method nodesRender nodes 요소 렌더링 준비
     */
    private nodesRender;
    /**
     * @method render 탐색된 요소 모두 렌더링
     */
    render(): void;
    /**
     * @method render 탐색된 요소 모두 렌더링
     * @param {NodeListOf<HTMLTypozElement> | HTMLTypozElement[]} [elements] 수동 추가 렌더링 요소
     */
    render(elements: NodeListOf<HTMLTypozElement> | HTMLTypozElement[]): void;
}
