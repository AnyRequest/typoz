import KoreanParser from './KoreanParser.js';
export default abstract class BaseParser {
    abstract readonly koreanParser: KoreanParser;
    protected abstract wordToLetters(word: string): string[];
    protected abstract wordToLettersWithEmpty(word: string): string[];
    abstract categorizing(sentence: string): string[][];
    abstract categorizingWithEmpty(sentence: string): string[][];
    abstract parse(sentence: string): string[][];
}
