import Parser from '@/modules/Parser';

const Josa = {
  EnNn: '은/는',
  EiGa: '이/가',
  ElRl: '을/를',
  GwaWa: '과/와',
} as const;
type Josa = (typeof Josa)[keyof typeof Josa];

type SearchOption = {
  withThrow: boolean;
};

export default class Util {
  static readonly Josa: typeof Josa = Josa;

  protected parser: Parser;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  verbToContinue(verb: string) {
    const parsed = this.parser.categorizing(verb);
    const isLeda = verb.endsWith('르다'); // end of 르다
    const isHada = verb.endsWith('하다');
    let isPositiveNucleus = false; // ㅏ ㅓ
    // let isStartPositive = false; // ㅗ + ㅏ, ㅜ + ㅓ
    const [start, end] = parsed.slice(...(isLeda ? [-3, -1] : [-2]));
    const isEi = start[1] === 'ㅣ';
    console.log(start, end);
    isPositiveNucleus = /[ㅗㅏ]/.test(start[1]);
    const hasBachim = !!start[2];
    const isBachimBiep = start[2] === 'ㅂ';
    const isBachimSiot = start[2] === 'ㅅ';
    console.log('is positive', isPositiveNucleus);
    console.log('has hasBachim', hasBachim);

    if (isHada) {
      const origin = verb.length >= 2 ? verb.slice(0, -2) : verb;
      return origin + '해';
    }

    if (isLeda) {
      // #ㄹ라
      const origin = verb.length >= 3 ? verb.slice(0, -3) : verb;
      if (isPositiveNucleus) {
        return (
          origin +
          this.parser.koreanParser.lettersToWord([...start, 'ㄹ']) +
          '라'
        );
      } else {
        return (
          origin +
          this.parser.koreanParser.lettersToWord([...start, 'ㄹ']) +
          '러'
        );
      }
    } else {
      const origin = verb.length >= 2 ? verb.slice(0, -2) : verb;
      if (isEi) {
        return (
          origin + this.parser.koreanParser.lettersToWord([start[0], 'ㅕ'])
        );
      } else {
        if (isBachimBiep) {
          return (
            origin +
            this.parser.koreanParser.lettersToWord([start[0], start[1]]) +
            (/[ㅏㅜㅣㅟ]/.test(start[1]) ? '워' : '와')
          );
        } else {
          return (
            origin +
            this.parser.koreanParser.lettersToWord(
              isBachimSiot ? [start[0], start[1]] : [...start],
            ) +
            (/[ㅡㅓㅜㅣㅟㅚ]/.test(start[1]) ? '어' : '아')
          );
        }
      }
    }
  }
  checkWrongSyntax(words: string) {}

  josa(word: string, type: Josa) {
    const letters = this.parser.categorizing(word);
    const lastWord = letters[letters.length - 1][2];
    const [bachim, noBachim] = type.split('/');
    if (lastWord) {
      return word + bachim;
    }
    return word + noBachim;
  }

  josaWith(words: string[], type: Josa) {
    const result = [];
    for (const word of words.slice(0, -1)) {
      result.push(this.josa(word, type));
    }
    result.push(words[words.length - 1]);
    return result.join(' ');
  }

  josaAnd(words: string[], type: Josa) {
    const result = [];
    for (const word of words.slice(0, -2)) {
      result.push(this.josa(word, type));
    }
    return [
      ...result,
      words[words.length - 2] + ',',
      '그리고',
      words[words.length - 1],
    ].join(' ');
  }

  searchByOnset(koreanWords: string[], onset: string, options?: SearchOption) {
    const foundWords = [];
    for (const kr of koreanWords) {
      const isKorean = this.parser.koreanParser.isKorean(kr);
      if (isKorean) {
        const parsed = this.parser.categorizing(kr);
        const onsetList = parsed.map((parsedWord) => parsedWord[0]);
        if (onsetList.join('').includes(onset)) {
          foundWords.push(kr);
        }
      } else {
        const errorMsg = `word is not korean`;
        if (options?.withThrow) {
          throw new TypeError(errorMsg, { cause: `word: ${kr}` });
        } else {
          console.error(`[${kr}] ` + errorMsg);
        }
      }
    }
    return foundWords;
  }
}
