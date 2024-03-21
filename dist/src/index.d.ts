import { Typoz } from './core/Typoz.js';
import Parser from './modules/Parser.js';
import KoreanParser from './modules/KoreanParser.js';
export declare const version: string;
export type OmitNodesOptions = Omit<Options, 'nodes'>;
export interface HTMLTypozElement extends HTMLElement {
    /**
     * @property {string[]} typings 요소가 렌더링할 타이핑 원문 배열
     */
    typings: string[];
    /**
     * @property {OmitNodesOptions} typozConfig 해당 요소의 노드 설정
     */
    typozConfig: OmitNodesOptions;
}
export type Node = {
    /**
     * @property {string} Node.select 노드의 지정된 id 또는 class명
     */
    select: string;
    /**
     * @property {string[]} Node.words 노드에 추가할 타이핑
     */
    words: string[];
    /**
     * @property {Options} Node.config 노드 설정
     */
    config: RecursivePartial<OmitNodesOptions>;
};
export type CursorStyle = {
    /**
     * @deprecated
     * @property {boolean} blink 커서 깜빡임 표시 여부
     * @default true
     */
    blink: boolean;
    /**
     * @deprecated
     * @property {number} blinkTime 깜빡임 속도
     * @default 1
     */
    blinkTime: number;
    /**
     * @deprecated
     * @property {string} content 커서에 표시할 기호
     * @default ""
     */
    content: string;
    /**
     * @property {string} color 커서 색상
     * @default "#56565656"
     */
    color: string;
    /**
     * @property {"horizontal"|"vertical"} dir 커서 방향
     * @default "vertical"
     */
    dir: 'horizontal' | 'vertical';
    /**
     * @property {number} size 커서 사이즈
     * @default 1
     */
    size: number;
    /**
     * @property {number} distance 커서와 글자 사이 거리
     * @default 0.1
     */
    distance: number;
};
/**
 * @description 타이핑 설정
 */
export interface Options {
    /**
     * @property {boolean} Options.autoRender 로드 시 타이핑 자동 실행
     * @default true
     */
    autoRender: boolean;
    /**
     * @property {{erase: boolean; reaelTyping: boolean; divide: boolean;}} Options.mode 타이핑 관련 모드 설정
     */
    mode: {
        /**
         * @property {boolean} Options.mode.erase 지우기 모드
         * @default true
         */
        erase: boolean;
        /**
         * @property {boolean} Options.mode.realTyping 랜덤 작문 속도 모드
         * @default false
         */
        realTyping: boolean;
        /**
         * @property {boolean} Options.mode.divide 타이핑 텍스트, 요소 분할
         * @default true
         */
        divide: boolean;
    };
    /**
     * @property {{write: number; erase: number}} Options.speed 타이핑 관련 속도 조정
     */
    speed: {
        /**
         * @property {boolean} Options.speed.write 쓰기 속도
         * @description 값이 클수록 빠릅니다.
         * @default 1
         */
        write: number;
        /**
         * @property {boolean} Options.speed.erase 지우기 속도
         * @description 값이 클수록 빠릅니다.
         * @default 5
         */
        erase: number;
    };
    /**
     * @property {boolean} Options.delay 글 쓴 후 대기 시간
     * @description 값이 클수록 길어집니다.
     * @default 3
     */
    delay: number;
    /**
     * @property {Node[]} Options.nodes 추가 노드 배열
     * @description 노드를 추가하면 렌더링에 포함됩니다.
     * @default []
     */
    nodes: Node[];
    /**
     * @param {string|string[]} Options.querySelector typoz가 찾는 노드의 기본 클래스명
     * @description 사용자 정의에 따라 변경된 클래스명으로 탐색 후 렌더링합니다.
     * @default ".typoz"
     */
    querySelector: string | string[];
    /**
     * @property {{cursor: CursorStyle}} Options.style 타이핑 관련 스타일 지정
     */
    style: {
        /**
         * @property {CursorStyle} 커서 스타일 지정
         */
        cursor: CursorStyle;
    };
}
export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
export { Typoz, Parser, KoreanParser };
export default Typoz;
