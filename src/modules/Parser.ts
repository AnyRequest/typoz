import BaseParser from './BaseParser';
import KoreanParser from './KoreanParser';

export default class Parser extends BaseParser {
  readonly koreanParser: KoreanParser;

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
   * @returns "[["ㅇ","ㅏ","ㄴ"], ["ㄴ","ㅕ","ㅇ"], ["ㅎ","ㅏ"], ["ㅅ", "ㅔ"]]"
   */
  categorizing(sentence: string): string[][] {
    const temp: string[][] = [];
    for (const word of sentence.trim()) {
      if (this.koreanParser.isKorean(word)) {
        const category = this.koreanParser.wordToLetters(word);
        temp.push(category);
      } else {
        const category = this.wordToLetters(word);
        temp.push(category);
      }
    }
    return temp;
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
        const category = this.koreanParser.wordToLettersWithEmpty(word);
        temp.push(category);
      } else {
        const category = this.wordToLettersWithEmpty(word);
        temp.push(category);
      }
    }
    return temp;
  }

  getTypingFlow(categorizedGroup: string[][]): string[][] {
    return categorizedGroup.map((group) => {
      const temp = [];
      if (group.some(this.koreanParser.isKorean)) {
        for (let i = 1; i <= group.length; i++) {
          const letters = group.slice(0, i);
          const convertLetter = this.koreanParser.lettersToWord(letters);
          temp.push(convertLetter);
        }
      } else {
        temp.push(...group);
      }
      return temp;
    });
  }

  /**
   *
   * @param sentences 문장 배열
   * @returns 타이핑 조각 2차 배열
   */
  parse(sentence: string): string[][] {
    if (sentence !== '') {
      const categorizedGroup = this.categorizing(sentence);
      const convertedFlow = this.getTypingFlow(categorizedGroup);
      return convertedFlow;
    } else {
      return [];
    }
  }
}
