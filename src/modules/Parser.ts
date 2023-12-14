import BaseParser from './BaseParser';
import KoreanParser from './KoreanParser';

export default class Parser extends BaseParser {
  protected readonly koreanParser: KoreanParser;

  constructor() {
    super();
    this.koreanParser = new KoreanParser();
  }

  /* 한글 외 음절에서 음소 단위로 분리 */
  protected wordToLetters(word: string) {
    return this.wordToLettersWithEmpty(word).filter((_) => _);
  }
  protected wordToLettersWithEmpty(word: string) {
    return [word, '', ''];
  }

  /**
   *
   * @param sentence 문장
   * @example "안녕하세요"
   */
  categorizingWithEmpty(sentence: string): string[][] {
    const temp: string[][] = [];
    for (const word of sentence) {
      if (this.koreanParser.isKorean(word)) {
        temp.push(this.koreanParser.wordToLettersWithEmpty(word));
      } else {
        temp.push(this.wordToLettersWithEmpty(word));
      }
    }
    return temp;
  }

  /**
   *
   * @param sentence 문장
   * @example "안녕하세요"
   */
  categorizing(sentence: string): string[][] {
    const temp: string[][] = [];
    for (const word of sentence.trim()) {
      if (this.koreanParser.isKorean(word)) {
        temp.push(this.koreanParser.wordToLetters(word));
      } else {
        temp.push(this.wordToLetters(word));
      }
    }
    return temp;
  }

  /**
   *
   * @param sentences 문장 배열
   * @returns 타이핑 조각 2차 배열
   */
  parse(sentence: string): string[][] {
    if (sentence !== '') {
      return this.categorizing(sentence);
    } else {
      return [];
    }
  }
}
