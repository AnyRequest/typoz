/**
 * @version 0.0.16
 */
import TypeNode from '../models/TypeNode';
import type { HTMLTypozElement, Options, RecursivePartial } from '..';
import TypeBuilder from '../modules/TypeBuilder';
export declare class Typoz {
    private readonly defaultConfig;
    private parser;
    /**
     * 빌더는 파서를 확장하여 사용됩니다.
     * @returns {TypeBuilder} 타입빌더를 반환합니다.
     */
    node(): TypeBuilder;
    config: Options;
    typeNodes: TypeNode[];
    typeBuilderNodes: TypeBuilder[];
    constructor();
    /**
     * @method initialize typoz 사용에서 항상 필수로 먼저 실행되어야 합니다.
     */
    initialize(): void;
    /**
     * @method destroy
     * SPA환경에서 hmr를 고려하여 에러를 우회하기 위해 typoz를 파괴합니다.
     * 다시 시작하려면 initialize와 globalConfig를 호출해야합니다.
     */
    destroy(): void;
    /**
     * @method globalConfig typoz의 모든 노드에 기본 적용되는 환경설정을 합니다.
     * @param {RecursivePartial<Options>} customConfigs 전역 환경 설정
     * globalConfig를 호출하면 자동으로 render메서드가 호출됩니다. autoRender가 false면 render메서드를 원하는 시점에서 호출해야합니다. autoRender의 기본 값은 true입니다.
     *
     */
    globalConfig(customConfigs?: RecursivePartial<Options>): void;
    convert(sentence: string): string[][];
    bulkConvert(sentences: string[]): string[][][];
    /**
     * @param {string} name 등록된 노드를 대상으로 타이핑을 다시 진행합니다.
     * 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 다시 진행합니다.
     */
    resume(): void;
    resume(name: string): void;
    /**
     * @param {string} name 등록된 노드를 대상으로 타이핑을 중단합니다.
     * 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 중단합니다.
     */
    pause(): void;
    pause(name: string): void;
    private defaultRender;
    private manualRender;
    private getConfigNodes;
    private nodesRender;
    render(): void;
    render(elements: NodeListOf<HTMLTypozElement> | HTMLTypozElement[]): void;
}
