import {
  createEl,
  createName,
  findOne,
  getCursorStyle,
  initializeTypozStyle,
  recursiveConfigApply,
} from '@/utils/feature';
import { DEFAULT_CONFIG } from '@/utils/global.instance';
import type { HTMLTypozElement, Options, Parser, RecursivePartial } from '..';

type Task = () => void | Promise<number>;

export default class TypeBuilder {
  static instance(parser: Parser) {
    return new TypeBuilder(parser);
  }
  static id: number = 0;

  private parser: Parser;
  id: number;
  name: string;
  config: Options = DEFAULT_CONFIG;
  typeNode: HTMLTypozElement;

  taskQueue: (() => (void | number) | Promise<void | number>)[] = [];
  pointer: number = 0;
  content = [];

  constructor(parser: Parser) {
    this.parser = parser;
  }

  private wait(time: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  select(select: string) {
    const element = findOne(select);
    TypeBuilder.id += 1;
    this.id = TypeBuilder.id;
    this.typeNode = element;
    this.name = createName();
    return this;
  }

  conf(config: RecursivePartial<Options> = DEFAULT_CONFIG) {
    if (config) recursiveConfigApply(this.config, config);
    const style = getCursorStyle(this.config.style.cursor, this.name, true);
    initializeTypozStyle(style);
    this.typeNode.setAttribute('typoz-id', '' + this.id);
    this.typeNode.setAttribute('typoz-name', this.name);
    this.typeNode.setAttribute('typoz-node-builder', '');
    this.typeNode.setAttribute('typoz-processed', '');
    this.typeNode.innerHTML = '';
    return this;
  }

  getCurrentRenderContentLength() {
    return this.content.length;
  }

  cursorUpdate(value: number) {
    if (
      this.pointer + value >= 0 &&
      this.pointer + value <= this.content.length
    )
      this.pointer += value;
  }

  pause(sec: number) {
    this.addTask(async () => {
      return await this.wait(sec * 1000);
    });
    return this;
  }

  commonWrite(letter: string) {
    this.addTask(async () => {
      this.content.splice(this.pointer, 0, letter);
      this.cursorUpdate(1);
      this.renderContent();
      return await this.wait((1 / this.config.speed.write) * 100);
    });
  }

  replace(point: number, word: string) {
    this.addTask(async () => {
      this.cursorUpdate(point);
      this.content.splice(this.pointer, 1, word);
      this.renderContent();
      return await this.wait((1 / this.config.speed.write) * 100);
    });
  }

  write(word: string) {
    for (const letter of word) {
      if (this.parser.koreanParser.isKorean(letter)) {
        const parsedKoreanLetter = this.parser.categorizing(letter);
        const typingFlows = this.parser.getTypingFlow(parsedKoreanLetter)[0];
        while (typingFlows.length > 0) {
          const letters = typingFlows.shift();
          this.replace(0, letters);
        }
        this.move(1);
      } else {
        this.commonWrite(letter);
      }
    }
    return this;
  }

  erase(value: number = 1) {
    for (let i = 0; i < value; i++) {
      this.addTask(async () => {
        this.cursorUpdate(-1);
        this.content.splice(this.pointer, 1);
        this.renderContent();
        return await this.wait((1 / this.config.speed.erase) * 100);
      });
    }
    return this;
  }

  allErase() {
    this.addTask(async () => {
      while (this.content.length > 0) {
        this.cursorUpdate(-1);
        this.content.pop();
        this.renderContent();
        await this.wait((1 / this.config.speed.erase / 5) * 100);
      }
      return (1 / this.config.speed.erase / 5) * 100;
    });
    return this;
  }

  move(value: number) {
    const abs = Math.abs(value);
    const amount = Math.floor(Math.abs(value) / value);
    for (let i = 0; i < abs; i++) {
      this.addTask(async () => {
        this.cursorUpdate(amount);
        this.renderContent();
        return await this.wait(this.config.delay * 100);
      });
    }
    return this;
  }

  addTask(task: Task) {
    this.taskQueue.push(task);
  }

  async run() {
    for (const task of this.taskQueue) {
      await task();
    }
  }

  renderContent() {
    this.typeNode.innerHTML = this.content
      .map(
        (_, __) =>
          createEl(
            'span',
            _,
            __ === this.pointer - 1
              ? {
                  name: 'typoz-cursor',
                  value: '',
                }
              : undefined,
          ).outerHTML,
      )
      .join('');
  }
}
