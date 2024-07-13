import Parser from '../modules/Parser.js';
type JosaValues = '은' | '는' | '이' | '가' | '을' | '를' | '과' | '와';
declare const Josa: {
    readonly EnNn: "은/는";
    readonly EiGa: "이/가";
    readonly ElRl: "을/를";
    readonly GwaWa: "과/와";
};
type Josa = (typeof Josa)[keyof typeof Josa];
type SearchOption = {
    withThrow: boolean;
};
export default class Util {
    static readonly Josa: typeof Josa;
    protected parser: Parser;
    constructor(parser: Parser);
    splitIndex(words: string, index: number): string[];
    splitIndexes(words: string, ...indexes: number[]): string[];
    verbToContinue(verb: string): string;
    josaOnly(wordOnly: string, type: Josa): string;
    josa(wordOnly: string, type: Josa): string;
    josaWith(wordOnlyList: string[], type: Josa): string;
    josaAnd(wordOnlyList: string[], type: Josa): string;
    searchByOnset(koreanWords: string[], onset: string, options?: SearchOption): any[];
    hasJosa(word: string): boolean;
    extractJosa(wordWithJosa: string): JosaValues | undefined;
    withCorrectJosa(wordWithJosa: string): string;
    findJosaKey(josa: JosaValues): keyof Josa;
    findJosa(josa: JosaValues): any;
    isCorrectJosa(wordWithJosa: string): boolean;
    checkJosa(nounWithJosa: string): string;
    checkJosa(noun: string, josa: string): string;
    checkOta(sentence: string): object[];
}
export {};
