/* istanbul ignore file */

import { Typex } from './core/Typex';
import Parser from './modules/Parser';
import KoreanParser from './modules/KoreanParser';

export interface HTMLTypexElement extends HTMLElement {
  typings: string[][][];
}

export type Node = {
  select: string;
  words: string[];
};
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

export { Typex, Parser, KoreanParser };

export default Typex;
