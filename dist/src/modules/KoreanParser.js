export default class KoreanParser {
    // prettier-ignore
    onset = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    // prettier-ignore
    nucleus = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    // prettier-ignore
    coda = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    gapLetterWithWord = 18816;
    startKorPoint = 12593;
    startKorWordPoint = 44032;
    // private readonly changeNucleusPoint: number = this.coda.length;
    changeOnsetPoint = this.coda.length * this.nucleus.length;
    /* 음소 단위 인덱싱 초기화 */
    korInitializePoint(word) {
        if (!this.isKorean(word))
            throw new TypeError('required only korean.');
        return word.charCodeAt(0) - this.startKorWordPoint;
    }
    /* 음소 단위 인덱싱 */
    onsetIndex(word) {
        return Math.floor(this.korInitializePoint(word) / this.changeOnsetPoint);
    }
    nucleusIndex(word) {
        return Math.floor((this.korInitializePoint(word) / this.coda.length) % this.nucleus.length);
    }
    codeIndex(word) {
        return Math.floor(this.korInitializePoint(word) % this.coda.length);
    }
    /* 음소 단위 가져오기 */
    getOnset(word) {
        return this.onset[this.onsetIndex(word)];
    }
    getNucleus(word) {
        return this.nucleus[this.nucleusIndex(word)];
    }
    getCoda(word) {
        return this.coda[this.codeIndex(word)];
    }
    /* 한글 판별 */
    isKorean(word) {
        return !!String(word).match(/[ㄱ-ㅎ가-힣]/g);
    }
    /* 음절에서 음소 단위로 분리 */
    wordToLetters(word) {
        return this.wordToLettersWithEmpty(word).filter((_) => _);
    }
    wordToLettersWithEmpty(word) {
        const onset = this.getOnset(word);
        const nucleus = this.getNucleus(word);
        const coda = this.getCoda(word);
        return [onset, nucleus, coda];
    }
    /* 음소 인덱싱 */
    getOnsetIndex(letter) {
        return this.onset.indexOf(letter);
    }
    getNucleusIndex(letter) {
        return this.nucleus.indexOf(letter);
    }
    getCodaIndex(letter) {
        return this.coda.indexOf(letter);
    }
    /* 음소 코드 추출 */
    getOnsetCode(letter) {
        const index = this.getOnsetIndex(letter);
        return index * this.changeOnsetPoint;
    }
    getNucleusCode(letter) {
        const index = this.getNucleusIndex(letter);
        return (index % this.nucleus.length) * this.coda.length;
    }
    getCodaCode(letter) {
        const index = this.getCodaIndex(letter);
        return index % this.coda.length;
    }
    /* 각 음소 코드 합계 추출 */
    getWordCode(letters) {
        let sum = 0;
        if (letters[0]) {
            sum += this.getOnsetCode(letters[0]);
        }
        if (letters[1]) {
            sum += this.getNucleusCode(letters[1]);
        }
        if (letters[2]) {
            sum += this.getCodaCode(letters[2]);
        }
        return sum + this.startKorWordPoint;
    }
    /* 음소 단위에서 음절로 조합 */
    lettersToWord(letters) {
        const code = this.getWordCode(letters);
        const word = String.fromCharCode(code);
        // return word;
        if (letters.length === 1) {
            return letters[0];
        }
        else {
            return word;
        }
    }
}
//# sourceMappingURL=KoreanParser.js.map