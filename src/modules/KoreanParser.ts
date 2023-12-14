export default class KoreanParser {
  // prettier-ignore
  private readonly onset: string[] = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  // prettier-ignore
  private readonly nucleus: string[] = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  // prettier-ignore
  private readonly coda: string[] = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  private readonly gapLetterWithWord: number = 18816;
  private readonly startKorPoint: number = 12593;
  private readonly startKorWordPoint: number = 44032;
  // private readonly changeNucleusPoint: number = this.coda.length;
  private readonly changeOnsetPoint: number =
    this.coda.length * this.nucleus.length;

  /* 음소 단위 인덱싱 초기화 */
  korInitializePoint(word: string) {
    if (!this.isKorean(word)) throw new TypeError('required only korean.');
    return word.charCodeAt(0) - this.startKorWordPoint;
  }

  /* 음소 단위 인덱싱 */
  onsetIndex(word: string): number {
    return Math.floor(this.korInitializePoint(word) / this.changeOnsetPoint);
  }
  nucleusIndex(word: string): number {
    return Math.floor(
      (this.korInitializePoint(word) / this.coda.length) % this.nucleus.length,
    );
  }
  codeIndex(word: string): number {
    return Math.floor(this.korInitializePoint(word) % this.coda.length);
  }

  /* 음소 단위 가져오기 */
  getOnset(word: string): string {
    return this.onset[this.onsetIndex(word)];
  }
  getNucleus(word: string): string {
    return this.nucleus[this.nucleusIndex(word)];
  }
  getCoda(word: string): string {
    return this.coda[this.codeIndex(word)];
  }

  /* 한글 판별 */
  isKorean(word: string): boolean {
    return !!String(word).match(/[ㄱ-힣]/g);
  }

  /* 음절에서 음소 단위로 분리 */
  wordToLetters(word: string): string[] {
    return this.wordToLettersWithEmpty(word).filter((_) => _);
  }
  wordToLettersWithEmpty(word: string): string[] {
    const onset = this.getOnset(word);
    const nucleus = this.getNucleus(word);
    const coda = this.getCoda(word);
    return [onset, nucleus, coda];
  }

  // getLetterCode(letter: string) {
  //   return letter.charCodeAt(0);
  // }
  // getOnsetCode(letterCode: number) {
  //   return letterCode ;
  // }
  // getNucleusCode(letterCode: number) {
  //   return letterCode;
  // }
  // getCodaCode(letterCode: number) {
  //   return letterCode;
  // }
  /* 음소 단위에서 음절로 조합 */
  lettersToWord(letters: [string]): number;
  lettersToWord(letters: [string, string]): number;
  lettersToWord(letters: [string, string, string]): number;
  lettersToWord(letters: string[]): number {
    let sum = 0;
    if (letters[0]) {
      const onsetCode = this.onset.indexOf(letters[0]);
      sum += onsetCode * this.changeOnsetPoint;
    }
    if (letters[1]) {
      const nucleusCode = this.nucleus.indexOf(letters[1]);
      sum += (nucleusCode % this.nucleus.length) * this.coda.length;
    }
    if (letters[2]) {
      const codaCode = this.coda.indexOf(letters[2]);
      sum += codaCode % this.coda.length;
    }
    return sum + this.startKorWordPoint;
  }
}
