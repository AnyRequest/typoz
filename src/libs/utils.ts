import Parser from '@/modules/Parser';

type JosaValues = '은' | '는' | '이' | '가' | '을' | '를' | '과' | '와';
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

  splitIndex(words: string, index: number) {
    if (index > words.length) {
      throw new RangeError('too much index');
    }
    return [words.slice(0, index), words.slice(index)].filter((_) => _);
  }

  splitIndexes(words: string, ...indexes: number[]) {
    let copy = words;
    const result: string[] = [];
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i];
      if (index <= 0) continue;
      const [splited, rest] = this.splitIndex(copy, index);
      result.push(splited);
      if (rest && indexes.length - 1 === i) {
        result.push(rest);
      }
      copy = copy.slice(index);
    }
    return result;
  }

  verbToContinue(verb: string) {
    const parsed = this.parser.categorizing(verb);
    const isLeda = verb.endsWith('르다'); // end of 르다
    const isHada = verb.endsWith('하다');
    let isPositiveNucleus = false; // ㅏ ㅓ
    // let isStartPositive = false; // ㅗ + ㅏ, ㅜ + ㅓ
    const [start, end] = parsed.slice(...(isLeda ? [-3, -1] : [-2]));
    const isEi = start[1] === 'ㅣ';
    // console.log(start, end);
    isPositiveNucleus = /[ㅗㅏ]/.test(start[1]);
    const hasBachim = !!start[2];
    const isBachimBiep = start[2] === 'ㅂ';
    const isBachimSiot = start[2] === 'ㅅ';
    // console.log('is positive', isPositiveNucleus);
    // console.log('has hasBachim', hasBachim);

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
          if (hasBachim) {
            return (
              origin +
              this.parser.koreanParser.lettersToWord(
                isBachimSiot ? [start[0], start[1]] : [...start],
              ) +
              (/[ㅡㅓㅜㅣㅟㅚ]/.test(start[1]) ? '어' : '아')
            );
          } else {
            return (
              origin +
              this.parser.koreanParser.lettersToWord(
                /[ㅜ]/.test(start[1]) ? [start[0], 'ㅝ'] : [...start],
              ) +
              (!/[ㅜ]/.test(start[1]) ? '어' : '')
            );
          }
        }
      }
    }
  }

  josaOnly(wordOnly: string, type: Josa) {
    const letters = this.parser.categorizing(wordOnly);
    console.log(wordOnly, letters);
    const lastWord = letters[letters.length - 1][2];
    const [bachim, noBachim] = type.split('/');
    if (lastWord) {
      return bachim;
    }
    return noBachim;
  }

  josa(wordOnly: string, type: Josa) {
    const letters = this.parser.categorizing(wordOnly);
    const lastWord = letters[letters.length - 1][2];
    const [bachim, noBachim] = type.split('/');
    if (lastWord) {
      return wordOnly + bachim;
    }
    return wordOnly + noBachim;
  }

  josaWith(wordOnlyList: string[], type: Josa) {
    const result = [];
    for (const wordOnly of wordOnlyList.slice(0, -1)) {
      result.push(this.josa(wordOnly, type));
    }
    result.push(wordOnlyList[wordOnlyList.length - 1]);
    return result.join(' ');
  }

  josaAnd(wordOnlyList: string[], type: Josa) {
    const result = [];
    for (const wordOnly of wordOnlyList.slice(0, -2)) {
      result.push(this.josa(wordOnly, type));
    }
    return [
      ...result,
      wordOnlyList[wordOnlyList.length - 2] + ',',
      '그리고',
      wordOnlyList[wordOnlyList.length - 1],
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

  hasJosa(word: string) {
    for (const key in Util.Josa) {
      const [bachim, noBachim] = Util.Josa[key].split('/');
      const hasIn = word.endsWith(bachim) || word.endsWith(noBachim);
      if (hasIn) return true;
    }
    return false;
  }

  extractJosa(wordWithJosa: string): JosaValues | undefined {
    const hasJosa = this.hasJosa(wordWithJosa);
    if (!hasJosa) return undefined;
    return wordWithJosa[wordWithJosa.length - 1] as JosaValues;
  }

  withCorrectJosa(wordWithJosa: string) {
    const josa = this.extractJosa(wordWithJosa);
    if (!josa) return undefined;
    const sliced = wordWithJosa.slice(0, -1);
    return this.josa(sliced, Util.Josa[this.findJosaKey(josa)]);
  }

  findJosaKey(josa: JosaValues): keyof Josa {
    const key = Object.entries(Util.Josa).find(([_key, value]) =>
      value.includes(josa),
    );
    if (!key) return undefined;
    return key[0] as keyof Josa;
  }
  findJosa(josa: JosaValues) {
    return Util.Josa[this.findJosaKey(josa)];
  }

  isCorrectJosa(wordWithJosa: string) {
    const josa = this.extractJosa(wordWithJosa);
    if (!josa) return undefined;
    const josaValue = this.findJosa(josa);
    return this.josa(wordWithJosa.slice(0, -1), josaValue) === wordWithJosa;
  }

  checkJosa(nounWithJosa: string): string;
  checkJosa(noun: string, josa: string): string;
  checkJosa(nounOrWithJosa: string, josa?: string) {
    if (josa) {
      const josaValue = this.findJosa(josa as JosaValues);
      const withCorrectJosa = this.josa(nounOrWithJosa, josaValue);
      return withCorrectJosa;
    } else {
      const withCorrectJosa = this.withCorrectJosa(nounOrWithJosa);
      return withCorrectJosa;
    }
  }

  checkOta(sentence: string) {
    const checkList: object[] = [];
    const words = sentence.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const hasJosa = this.hasJosa(word);
      if (hasJosa) {
        if (word.length === 1 && i > 0) {
          const withCorrectJosa = this.checkJosa(words[i - 1], word);
          checkList.push({
            problem: word,
            index: i,
            correct: withCorrectJosa,
            detail: '조사는 붙여써야 합니다.',
          });
        } else {
          const isCorrectJosa = this.isCorrectJosa(word);
          if (!isCorrectJosa) {
            const withCorrectJosa = this.checkJosa(word);
            checkList.push({
              problem: word,
              index: i,
              correct: withCorrectJosa,
            });
          } else {
            console.log('empty');
          }
        }
      }
    }
    return checkList;
  }
}
