import type { HTMLTypozElement, OmitNodesOptions } from '../index.js';
export default class TypeNode {
    /**
     * @static
     * @property {number} id 타입노드 auto increment id
     */
    static id: number;
    /** @property {number} id 타입노드 고유 id */
    id: number;
    /** @property {string} name 타입노드 고유 랜덤 네임 */
    name: string;
    /** @property {string[][][]} typingList 파싱된 타이핑 3차 배열 */
    typingList: string[][][];
    /** @property {OmitNodesOptions} config 타입노드 설정 */
    config: OmitNodesOptions;
    /** @property {HTMLTypozElement} element 타입노드 지정 요소 */
    element: HTMLTypozElement;
    /**
     * @property {boolean} isStarted 렌더링 시작 여부
     * @default false
     */
    isStarted: boolean;
    /** @property {string} injectStyle 주입 스타일 텍스트 */
    injectStyle: string;
    /**
     * @private
     * @property {number} order 주입 스타일 텍스트
     * @default 0
     */
    private order;
    /**
     * @private
     * @property {boolean} stop 정지 신호
     * @default false
     */
    private stop;
    /**
     * @private
     * @property {(value: boolean) => void} play 렌더링 시작 resolver
     */
    private play;
    constructor(el: HTMLTypozElement, config: OmitNodesOptions, typings: string[][][]);
    /**
     * @method orderUp 타이핑 순서 증가
     * @description 0에서 타이핑 배열의 갯수-1 까지 순환 증가합니다.
     * @example
     * // typingList.length === 3
     * // current order === 3
     * orderUp();
     * // current order === 0
     */
    orderUp(): void;
    /**
     * @private
     * @method setup 타입노드 초기화 메서드
     */
    private setup;
    /**
     * @private
     * @method copyCurrent 타이핑 항목 복사
     * @returns {string[][]} Returns string array
     */
    private copyCurrent;
    /**
     * @method resume 렌더링 다시 재생
     */
    resume(): void;
    /**
     * @method pause 렌더링 정지
     */
    pause(): void;
    /**
     * @method clear 렌더링 시작 초기화
     */
    clear(): void;
    /**
     * @method destroy 타입노드 해제 및 초기화
     */
    destroy(): void;
    /**
     * @private
     * @method wait 애니메이션 딜레이
     * @returns {Promise<unknown>} Returns promise
     */
    private wait;
    /**
     * @method run 초기 렌더링 시작 메서드
     * @description 외부에서 호출하기위해 제작되었습니다.
     */
    run(): void;
    /**
     * @private
     * @method renderEraseDivide divide모드 타이핑 지우기
     * @param {string[][]} eraseArray 지울 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    private renderEraseDivide;
    /**
     * @private
     * @method renderWriteDivide divide모드로 타이핑 쓰기
     * @param {string[][]} writeArray 쓸 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    private renderWriteDivide;
    /**
     * @method renderErase 일반 타이핑 지우기
     * @param {string[][]} eraseArray 지울 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    private renderErase;
    /**
     * @private
     * @method renderWrite 일반 타이핑 쓰기
     * @param {string[][]} writeArray 쓸 타이핑 리스트
     * @returns {Promise<unknown>} Returns promise
     */
    private renderWrite;
    /**
     * @async
     * @method render 타입노드 렌더링
     * @returns {Promise<void>} Returns promise
     */
    render(): Promise<void>;
}
