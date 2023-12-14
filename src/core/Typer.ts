import Parser from '@/modules/Parser';

export class Typer {
  private readonly defaultConfig: Options = {
    onLoad: true,
    mode: {
      erase: true,
      realTyping: false,
      divide: true,
    },
    speed: {
      write: 1,
      erase: 1,
    },
    nodes: [],
    querySelector: '.typer',
  };
  config: Options;
  parser: Parser;

  private recursiveConfigApply(
    config: Options,
    customConfigs: RecursivePartial<Options>,
  ) {
    for (const key of Object.keys(customConfigs)) {
      if (
        typeof config[key] !== 'string' &&
        typeof config[key] !== 'number' &&
        typeof config[key] !== 'boolean'
      ) {
        this.recursiveConfigApply(config[key], customConfigs[key]);
      } else {
        config[key] = customConfigs[key];
      }
    }
  }

  globalConfig(customConfigs: RecursivePartial<Options>): void {
    this.recursiveConfigApply(this.config, customConfigs);
    // console.debug('after apply global config:', this.config);
  }

  initialize(): void {
    //
    this.config = this.defaultConfig;
  }

  convert(sentence: string): string[][];
  convert(sentences: string): string[][] {
    return this.parser.parse(sentences);
  }

  bulkConvert(sentences: string[]): string[][][] {
    const temp: string[][][] = [];
    for (const sentence of sentences) {
      temp.push(this.convert(sentence));
    }
    return temp;
  }

  render(element: Element): void;
  render(elements: Element[]): void;
  render(elements: Element | Element[]): void {
    //
  }
}
