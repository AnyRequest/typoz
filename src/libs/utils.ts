import Parser from '@/modules/Parser';

const Josa = {
  EnNn: '은/는',
  EiGa: '이/가',
  ElRl: '을/를',
  GwaWa: '과/와',
} as const;
type Josa = (typeof Josa)[keyof typeof Josa];

export default class Util {
  static readonly Josa: typeof Josa = Josa;

  protected parser: Parser;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  josa(word: string, type: Josa) {
    const letters = this.parser.categorizing(word);
    const lastWord = letters[letters.length - 1][2];
    const [bachim, noBachim] = type.split('/');
    if (lastWord) {
      return word + bachim;
    }
    return word + noBachim;
  }

  josas(words: string[], type: Josa) {
    const result = [];
    for (const word of words.slice(0, -1)) {
      result.push(this.josa(word, type));
    }
    result.push(words[words.length - 1]);
    return result.join(' ');
  }
}
