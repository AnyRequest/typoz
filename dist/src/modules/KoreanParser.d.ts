export default class KoreanParser {
    private readonly onset;
    private readonly nucleus;
    private readonly coda;
    private readonly gapLetterWithWord;
    private readonly startKorPoint;
    private readonly startKorWordPoint;
    private readonly changeOnsetPoint;
    korInitializePoint(word: string): number;
    onsetIndex(word: string): number;
    nucleusIndex(word: string): number;
    codeIndex(word: string): number;
    getOnset(word: string): string;
    getNucleus(word: string): string;
    getCoda(word: string): string;
    isKorean(word: string): boolean;
    wordToLetters(word: string): string[];
    wordToLettersWithEmpty(word: string): string[];
    getOnsetIndex(letter: string): number;
    getNucleusIndex(letter: string): number;
    getCodaIndex(letter: string): number;
    getOnsetCode(letter: string): number;
    getNucleusCode(letter: string): number;
    getCodaCode(letter: string): number;
    getWordCode(letters: string[]): number;
    lettersToWord(letters: string[]): string;
}
