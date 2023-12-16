/* istanbul ignore file */

import { Typoz } from './core/Typoz';
import Parser from './modules/Parser';
import KoreanParser from './modules/KoreanParser';

export interface HTMLTypozElement extends HTMLElement {
  typings: string[];
  typozConfig: Options;
}

export type Node = {
  select: string;
  words: string[];
  config: RecursivePartial<Options>;
};

/**
 * @param {Options} customConfigs 타이퍼 설정
 * @param {Options['autoRender']} [customConfigs.autoRender=true] 로드 시 타이퍼 자동 실행
 * @param {Options['mode']} customConfigs.mode 타이핑 모드 설정
 * @param {Options['mode']['erase']} [customConfigs.mode.erase=true] 지우기 모드 on/off
 * @param {Options['mode']['realTyping']} [customConfigs.mode.realTyping=false] 랜덤 작문 속도 모드 on/off
 * @param {Options['mode']['divide']} [customConfigs.mode.divide=true] 타이핑 텍스트, 요소 분할 모드 설정
 * @param {Options['speed']} customConfigs.speed 타이퍼 속도 조정
 * @param {Options['speed']['erase']} [customConfigs.speed.erase=1] 지우기 속도 조정 (지우기 모드가 켜져있어야 합니다.)
 * @param {Options['speed']['write']} [customConfigs.speed.write=1] 쓰기 속도 조정
 * @param {Options['delay']} [customConfigs.delay=5] 쓰기 및 지우기 후 기다리는 시간 조정
 * @param {Array<Node>} [customConfigs.nodes=[]] 로드 시 타이퍼 자동 실행
 * @param {Node['select']} customConfigs.nodes[].select 노드 쿼리 셀렉터 네임
 * @param {Node['words']} customConfigs.nodes[].words[] 추가 텍스트
 * @param {Options['querySelector']} customConfigs.querySelector 로드 시 타이퍼 자동 실행
 */
export interface Options {
  autoRender: boolean;
  mode: {
    erase: boolean;
    realTyping: boolean;
    divide: boolean;
  };
  speed: {
    write: number;
    erase: number;
  };
  delay: number;
  nodes: Node[];
  querySelector: string | string[];
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export { Typoz, Parser, KoreanParser };

export default Typoz;
