export default class KoreanParser {
    onset = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    nucleus = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    coda = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    gapLetterWithWord = 18816;
    startKorPoint = 12593;
    startKorWordPoint = 44032;
    changeOnsetPoint = this.coda.length * this.nucleus.length;
    korInitializePoint(word) {
        if (!this.isKorean(word))
            throw new TypeError('required only korean.');
        return word.charCodeAt(0) - this.startKorWordPoint;
    }
    onsetIndex(word) {
        return Math.floor(this.korInitializePoint(word) / this.changeOnsetPoint);
    }
    nucleusIndex(word) {
        return Math.floor((this.korInitializePoint(word) / this.coda.length) % this.nucleus.length);
    }
    codeIndex(word) {
        return Math.floor(this.korInitializePoint(word) % this.coda.length);
    }
    getOnset(word) {
        return this.onset[this.onsetIndex(word)];
    }
    getNucleus(word) {
        return this.nucleus[this.nucleusIndex(word)];
    }
    getCoda(word) {
        return this.coda[this.codeIndex(word)];
    }
    isKorean(word) {
        return !!String(word).match(/[ㄱ-ㅎ가-힣]/g);
    }
    wordToLetters(word) {
        return this.wordToLettersWithEmpty(word).filter((_) => _);
    }
    wordToLettersWithEmpty(word) {
        const onset = this.getOnset(word);
        const nucleus = this.getNucleus(word);
        const coda = this.getCoda(word);
        return [onset, nucleus, coda];
    }
    getOnsetIndex(letter) {
        return this.onset.indexOf(letter);
    }
    getNucleusIndex(letter) {
        return this.nucleus.indexOf(letter);
    }
    getCodaIndex(letter) {
        return this.coda.indexOf(letter);
    }
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
    lettersToWord(letters) {
        const code = this.getWordCode(letters);
        const word = String.fromCharCode(code);
        if (letters.length === 1) {
            return letters[0];
        }
        else {
            return word;
        }
    }
}
//# sourceMappingURL=KoreanParser.js.map