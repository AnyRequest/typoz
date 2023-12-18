import TypeNode from '@/models/TypeNode';
import Parser from '@/modules/Parser';
import {
  copyConfig,
  findElements,
  findOne,
  getCursorStyle,
  initializeTypozStyle,
  recursiveConfigApply,
  trimInnerText,
} from '@/utils/feature';
import type { HTMLTypozElement, Node, Options, RecursivePartial } from '..';
import TypeBuilder from '@/modules/TypeBuilder';
import { DEFAULT_CONFIG } from '@/utils/global.instance';

export class Typoz {
  private readonly defaultConfig: Options = DEFAULT_CONFIG;
  private parser: Parser;

  /**
   * 빌더는 파서를 확장하여 사용됩니다.
   * @returns {TypeBuilder} 타입빌더를 반환합니다.
   */
  node(): TypeBuilder {
    return TypeBuilder.instance(this.parser);
  }
  // private domManager: DomManager;

  config: Options;
  typeNodes: TypeNode[] = [];

  constructor() {
    this.parser = new Parser();
    // this.domManager = new DomManager();
  }

  /**
   * @method initialize typoz 사용에서 항상 필수로 먼저 실행되어야 합니다.
   */
  initialize(): void {
    this.config = copyConfig(this.defaultConfig);
  }

  /**
   * @method destroy
   * SPA환경에서 hmr를 고려하여 에러를 우회하기 위해 typoz를 파괴합니다.
   * 다시 시작하려면 initialize와 globalConfig를 호출해야합니다.
   */
  destroy() {
    this.config = copyConfig(this.defaultConfig);
    TypeNode.id = 0;
    TypeBuilder.id = 0;
    for (const typing of this.typeNodes) {
      typing.destroy();
    }
    this.typeNodes = [];
    document.head.querySelectorAll('[typoz-styles]').forEach((style) => {
      style?.remove?.();
    });
  }

  /**
   * @method globalConfig typoz의 모든 노드에 기본 적용되는 환경설정을 합니다.
   * @param {RecursivePartial<Options>} customConfigs 전역 환경 설정
   * globalConfig를 호출하면 자동으로 render메서드가 호출됩니다. autoRender가 false면 render메서드를 원하는 시점에서 호출해야합니다. autoRender의 기본 값은 true입니다.
   *
   */
  globalConfig(
    customConfigs: RecursivePartial<Options> = DEFAULT_CONFIG,
  ): void {
    if (customConfigs) recursiveConfigApply(this.config, customConfigs);
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

  /**
   * @param {string} name 등록된 노드를 대상으로 타이핑을 다시 진행합니다.
   * 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 다시 진행합니다.
   */
  resume(): void;
  resume(name: string): void;
  resume(name?: string): void {
    /* istanbul ignore next */
    if (name !== null && name !== undefined && typeof name === 'string') {
      const typing = this.typeNodes.find((typing) => typing.name === name);
      if (typing) {
        typing.resume();
      }
    } else {
      for (const typing of this.typeNodes) {
        typing.resume();
      }
    }
  }

  /**
   * @param {string} name 등록된 노드를 대상으로 타이핑을 중단합니다.
   * 파라미터가 없으면 등록된 모든 노드를 대상을 타이핑을 중단합니다.
   */
  pause(): void;
  pause(name: string): void;
  pause(name?: string): void {
    /* istanbul ignore next */
    if (name !== null && name !== undefined && typeof name === 'string') {
      const typing = this.typeNodes.find((typing) => typing.name === name);
      if (typing) {
        typing.pause();
      }
    } else {
      for (const typing of this.typeNodes) {
        typing.pause();
      }
    }
  }

  private defaultRender() {
    const defaultElements = findElements(this.config.querySelector);
    for (const element of [...new Set(defaultElements)]) {
      const trimText = element.innerText.trim();
      if (trimText !== '') {
        if (!Object.hasOwn(element, 'typings')) {
          element.typings = [];
        }
        element.typings.push(trimText.trim());
      }
      const converted = this.convert(trimText);
      const typingModel = new TypeNode(
        element,
        element.typozConfig || JSON.parse(JSON.stringify(this.config)),
        [converted],
      );

      this.typeNodes.push(typingModel);
    }
  }

  private manualRender(
    elements: NodeListOf<HTMLTypozElement> | HTMLTypozElement[],
  ) {
    for (const element of [...new Set(elements)]) {
      const trimText = element.innerText.trim();
      if (trimText !== '') {
        if (!Object.hasOwn(element, 'typings')) {
          element.typings = [];
        }
        element.typings.push(trimText.trim());
      }
      const converted = this.convert(trimText);
      const typingModel = new TypeNode(
        element,
        element.typozConfig || JSON.parse(JSON.stringify(this.config)),
        [converted],
      );

      this.typeNodes.push(typingModel);
    }
  }

  private getConfigNodes(): HTMLTypozElement[] {
    if ((this.config.nodes as Node[]).length > 0) {
      return (this.config.nodes as Node[]).reduce(
        (acc, { select, words, config }) => {
          const target = findOne(select);
          /* istanbul ignore next */
          if (target) {
            target.setAttribute;
            if (!Object.hasOwn(target, 'typozConfig')) {
              const copy = JSON.parse(JSON.stringify(this.config));
              recursiveConfigApply(copy, config || this.config);
              target.typozConfig = copy;
            }
            const targetText = trimInnerText(target);
            if (targetText !== '') {
              if (!Object.hasOwn(target, 'typings')) {
                target.typings = [];
              }
              target.typings.push(targetText.trim());
            }
            if (words?.length > 0) {
              target.typings.push(...words.map((_) => _.trim()));
            }
            acc.push(target);
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

  private nodesRender() {
    const nodesElements = this.getConfigNodes();
    for (const element of [...new Set(nodesElements)]) {
      const parseBaseText = element.innerText.trim();
      const parsedSentences = [parseBaseText];
      if (element.typings?.length > 0) {
        parsedSentences.push(...element.typings);
      }
      const typingModel = new TypeNode(
        element,
        element.typozConfig || JSON.parse(JSON.stringify(this.defaultConfig)),
        this.bulkConvert([...new Set(parsedSentences)]),
      );

      if (!this.typeNodes.includes(typingModel)) {
        this.typeNodes.push(typingModel);
      }
    }
  }

  render(): void;
  render(elements: NodeListOf<HTMLTypozElement> | HTMLTypozElement[]): void;
  render(elements?: NodeListOf<HTMLTypozElement> | HTMLTypozElement[]): void {
    let styles = '';

    styles += getCursorStyle(this.config.style.cursor);

    this.defaultRender();
    this.manualRender(elements);
    this.nodesRender();

    for (const typing of this.typeNodes) {
      styles += typing.injectStyle + '\n';
      typing.run();
    }

    initializeTypozStyle(styles);
  }
}
