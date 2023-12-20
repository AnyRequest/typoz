import BaseParser from './BaseParser.js';
import KoreanParser from './KoreanParser.js';
export default class Parser extends BaseParser {
    readonly koreanParser: KoreanParser;
    constructor();
    protected wordToLetters(word: string): string[];
    protected wordToLettersWithEmpty(word: string): string[];
    /**
     *
     * @param sentence 문장
     * @example "안녕하세요"
     */
    categorizing(sentence: string): string[][];
    /**
     *
     * @param sentence 문장
     * @example "안녕하세요"
     */
    categorizingWithEmpty(sentence: string): string[][];
    getTypingFlow(categorizedGroup: string[][]): string[][];
    /**
     *
     * @param sentences 문장 배열
     * @returns 타이핑 조각 2차 배열
     */
    parse(sentence: string): string[][];
}
