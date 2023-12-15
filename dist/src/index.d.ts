import { Typoz } from './core/Typoz';
import Parser from './modules/Parser';
import KoreanParser from './modules/KoreanParser';
export interface HTMLTypozElement extends HTMLElement {
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
export { Typoz, Parser, KoreanParser };
export default Typoz;
