import Typing from '@/models/Typing';
import Parser from '@/modules/Parser';
import type { HTMLTypexElement, Node, Options, RecursivePartial } from '..';

export class Typex {
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
    querySelector: '.typex',
  };
  private parser: Parser;

  config: Options;
  typingList: Typing[] = [];

  constructor() {
    this.parser = new Parser();
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

  private findElements(): NodeListOf<HTMLTypexElement> {
    return document.querySelectorAll(
      [].concat(this.config.querySelector).join(','),
    );
  }

  initialize(): void {
    this.config = this.defaultConfig;
  }

  // /**
  //  * @param {Options} customConfigs 타이퍼 설정
  //  * @param {Options['autoRender']} [customConfigs.autoRender=true] 로드 시 타이퍼 자동 실행
  //  * @param {Options['mode']} customConfigs.mode 타이핑 모드 설정
  //  * @param {Options['mode']['erase']} [customConfigs.mode.erase=true] 지우기 모드 on/off
  //  * @param {Options['mode']['realTyping']} [customConfigs.mode.realTyping=false] 랜덤 작문 속도 모드 on/off
  //  * @param {Options['mode']['divide']} [customConfigs.mode.divide=true] 타이핑 텍스트, 요소 분할 모드 설정
  //  * @param {Options['speed']} customConfigs.speed 타이퍼 속도 조정
  //  * @param {Options['speed']['erase']} [customConfigs.speed.erase=1] 지우기 속도 조정 (지우기 모드가 켜져있어야 합니다.)
  //  * @param {Options['speed']['write']} [customConfigs.speed.write=1] 쓰기 속도 조정
  //  * @param {Options['delay']} [customConfigs.delay=5] 쓰기 및 지우기 후 기다리는 시간 조정
  //  * @param {Array<Node>} [customConfigs.nodes=[]] 로드 시 타이퍼 자동 실행
  //  * @param {Node['select']} customConfigs.nodes[].select 노드 쿼리 셀렉터 네임
  //  * @param {Node['words']} customConfigs.nodes[].words[] 추가 텍스트
  //  * @param {Options['querySelector']} customConfigs.querySelector 로드 시 타이퍼 자동 실행
  //  */
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
      querySelector: '.typex',
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

  getConfigNodes(): HTMLTypexElement[] {
    if ((this.config.nodes as Node[]).length > 0) {
      return (this.config.nodes as Node[]).reduce((acc, { select, words }) => {
        const target = document.querySelector(select) as HTMLTypexElement;
        /* istanbul ignore next */
        if (target) {
          const targetText = target.innerText.trim();
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
      }, []);
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
  render(element: HTMLTypexElement): void;
  render(elements: HTMLTypexElement[]): void;
  render(elements?: HTMLTypexElement | HTMLTypexElement[]): void {
    const temp: HTMLTypexElement[] = [];
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
      const defaultElements = this.findElements();
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
        JSON.parse(JSON.stringify(this.config)),
        parsedSentences,
      );

      styles += typingModel.injectStyle + '\n';
      this.typingList.push(typingModel);
      typingModel.run();
    }
    const typexDefaultStyle = document.createElement('style');
    typexDefaultStyle.innerText = styles;
    document.head.append(typexDefaultStyle);
  }
}
