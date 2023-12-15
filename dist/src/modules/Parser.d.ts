import BaseParser from './BaseParser';
import KoreanParser from './KoreanParser';
export default class Parser extends BaseParser {
    readonly koreanParser: KoreanParser;
    constructor();
    protected wordToLetters(word: string): string[];
    protected wordToLettersWithEmpty(word: string): string[];
    categorizing(sentence: string): string[][];
    categorizingWithEmpty(sentence: string): string[][];
    getTypingFlow(categorizedGroup: string[][]): any[][];
    parse(sentence: string): string[][];
}
