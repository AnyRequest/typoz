import Typing from '@/models/Typing';
import Parser from '@/modules/Parser';
import DomManager from '@/plugins/DomManager';
import type { HTMLTypozElement, Node, Options, RecursivePartial } from '..';

export class Typoz {
  private readonly defaultConfig: Options = {
    autoRender: true,
    mode: {
      erase: true,
      realTyping: false,
      divide: true,
    },
    speed: {
      write: 1,
      erase: 1,
    },
    delay: 5,
    nodes: [],
    querySelector: '.typoz',
  };
  private parser: Parser;
  private domManager: DomManager;

  config: Options;
  typingList: Typing[] = [];

  constructor() {
    this.parser = new Parser();
    this.domManager = new DomManager();
  }

  private recursiveConfigApply(
    config: Options,
    customConfigs: RecursivePartial<Options>,
  ) {
    for (const key of Object.keys(customConfigs)) {
      if (
        typeof config[key] !== 'string' &&
        typeof config[key] !== 'number' &&
        typeof config[key] !== 'boolean' &&
        !(config[key] instanceof Array)
      ) {
        this.recursiveConfigApply(config[key], customConfigs[key]);
      } else {
        config[key] = customConfigs[key];
      }
    }
  }

  initialize(): void {
    this.config = this.defaultConfig;
  }

  globalConfig(
    customConfigs: RecursivePartial<Options> = {
      autoRender: true,
      mode: {
        erase: true,
        realTyping: false,
        divide: true,
      },
      speed: {
        write: 1,
        erase: 1,
      },
      delay: 5,
      nodes: [],
      querySelector: '.typoz',
    },
  ): void {
    if (customConfigs) this.recursiveConfigApply(this.config, customConfigs);

    if (this.config.autoRender) {
      this.render();
    }
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

  getConfigNodes(): HTMLTypozElement[] {
    if ((this.config.nodes as Node[]).length > 0) {
      return (this.config.nodes as Node[]).reduce(
        (acc, { select, words, config }) => {
          const target = this.domManager.findOne(select);
          /* istanbul ignore next */
          if (target) {
            if (!Object.hasOwn(target, 'typozConfig')) {
              const copy = JSON.parse(JSON.stringify(this.defaultConfig));
              this.recursiveConfigApply(copy, config || this.config);
              target.typozConfig = copy;
            }
            const targetText = this.domManager.trimInnerText(target);
            if (targetText !== '') {
              if (!Object.hasOwn(target, 'typings')) {
                target.typings = [];
              }
              target.typings.push(this.convert(targetText));
              if (words.length > 0) {
                target.typings.push(...this.bulkConvert(words));
              }
              acc.push(target);
            }
          } else {
            /* istanbul ignore next */
            console.error(
              new SyntaxError('not found element.', { cause: select }),
            );
          }
          return acc;
        },
        [],
      );
    }
    return [];
  }

  resume(): void;
  resume(name: string): void;
  resume(name?: string): void {
    /* istanbul ignore next */
    if (name !== null && name !== undefined && typeof name === 'string') {
      const typing = this.typingList.find((typing) => typing.name === name);
      if (typing) {
        typing.resume();
      }
    } else {
      for (const typing of this.typingList) {
        typing.resume();
      }
    }
  }

  pause(): void;
  pause(name: string): void;
  pause(name?: string): void {
    /* istanbul ignore next */
    if (name !== null && name !== undefined && typeof name === 'string') {
      const typing = this.typingList.find((typing) => typing.name === name);
      if (typing) {
        typing.pause();
      }
    } else {
      for (const typing of this.typingList) {
        typing.pause();
      }
    }
  }

  render(): void;
  render(element: HTMLTypozElement): void;
  render(elements: HTMLTypozElement[]): void;
  render(elements?: HTMLTypozElement | HTMLTypozElement[]): void {
    const temp: HTMLTypozElement[] = [];
    let styles = '';
    let increaseId = 0;

    /* istanbul ignore next */
    if (elements) {
      /* istanbul ignore next */
      if (elements instanceof Array) {
        temp.push(...elements);
      } else {
        temp.push(elements);
      }
    } else {
      const defaultElements = this.domManager.findElements(
        this.config.querySelector,
      );
      temp.push(...defaultElements);
    }

    temp.push(...this.getConfigNodes());

    for (const element of [...new Set(temp)]) {
      // if(this.config.nodes)
      const id = ++increaseId;
      const parseBaseText = this.convert(element.innerText.trim());
      const parsedSentences = [parseBaseText];
      if (element.typings?.length > 0) {
        parsedSentences.push(...element.typings);
      }
      const typingModel = new Typing(
        id,
        element,
        element.typozConfig,
        parsedSentences,
      );

      styles += typingModel.injectStyle + '\n';
      this.typingList.push(typingModel);
      typingModel.run();
    }
    this.domManager.initializeTypozStyle(styles);
  }
}
