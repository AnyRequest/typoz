import {
  createEl,
  createName,
  deprecatedMessage,
  findOne,
  getCursorStyle,
  initializeTypozStyle,
  recursiveConfigApply,
} from '@/utils/feature';
import { DEFAULT_CONFIG } from '@/utils/global.instance';
import type {
  HTMLTypozElement,
  OmitNodesOptions,
  Parser,
  RecursivePartial,
} from '..';

type Task = () => void | Promise<number>;

export default class TypeBuilder {
  /**
   * @static
   * @method instance 타입빌더 인스턴스
   * @param parser 텍스트 분석기
   * @returns {TypeBuilder} 타입빌더 반환
   */
  static instance(parser: Parser) {
    return new TypeBuilder(parser);
  }
  /**
   * @static
   * @property {number} id 타입빌더 auto increment id
   */
  static id: number = 0;

  /**
   * @private
   * @property {Parser} parser 텍스트 분석기
   */
  private parser: Parser;
  /** @property {number} id 타입빌더 고유 id */
  id: number;
  /** @property {string} name 타입빌더 고유 랜덤 네임 */
  name: string;
  /** @property {OmitNodesOptions} config 타입빌더 설정 */
  _config: OmitNodesOptions = DEFAULT_CONFIG;
  /**
   * @property {HTMLTypozElement} typeNode 타입빌더 지정 요소
   */
  typeNode: HTMLTypozElement;
  /**
   * @private
   * @property {string} originContent 타입빌더 지정 요소의 원본 텍스트
   */
  private originContent: string;

  /** @property {Task[]} taskQueue 빌더의 작업 배열 */
  taskQueue: Task[] = [];
  /** @property {number} pointer 커서의 위치 인덱스 */
  pointer: number = 0;
  /** @property {string[]} content 타입빌더 출력 배열 */
  content: string[] = [];

  /**
   * @property {boolean} stop destroy 호출 시 true로 변경
   * @default false
   */
  stop: boolean = false;

  /**
   * @private
   * @property {boolean} pauseRender 일시정지 시그널
   */
  private pauseSignal: boolean = false;

  /**
   * @private
   * @property {Function} resumeResolver 재개 활성화 리졸버
   */
  private resumeResolver: (value: boolean) => void;

  /**
   * @private
   * @property {Promise<boolean>} pausePromise 일시정지 펜딩 변수
   */
  private pausePromise: Promise<boolean>;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  /**
   * @method pauseRender 렌더링 일시정지
   * @since 0.1.0
   * @example
   * window.addEventListener("click", () => {
   *  if(toggle) {
   *    // resume render
   *    typoz.typeBuilderNodes[0]?.resumeRender();
   *  } else {
   *    // pause render
   *    typoz.typeBuilderNodes[0]?.pauseRender();
   *  }
   * });
   */
  pauseRender() {
    this.pauseSignal = true;
    this.pausePromise = new Promise<boolean>((resolve) => {
      this.resumeResolver = resolve;
    });
  }

  /**
   * @method resumeRender 렌더링 재개
   * @since 0.1.0
   * @see pauseRender
   */
  resumeRender() {
    this.resumeResolver(true);
    this.pauseSignal = false;
    this.resumeResolver = undefined;
    this.pausePromise = undefined;
  }

  /**
   * @private
   * @method wait 비동기 대기 메서드
   * @param {number} time 대기 시간
   * @returns {Promise<number>}
   */
  private wait(time: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  /**
   * @method select 노드 선택 메서드
   * @param select 노드의 id 또는 class 선택자
   * @example
   * typoz.node().select("#target1");
   * typoz.node().select(".my-typoz-target");
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  select(select: string): TypeBuilder {
    const element = findOne(select);
    TypeBuilder.id += 1;
    this.id = TypeBuilder.id;
    this.typeNode = element;
    this.originContent = element.innerHTML;
    this.name = createName();
    return this;
  }

  /**
   * @deprecated since version 0.0.19
   * @method config
   * @returns {TypeBuilder} Returns a TypeBuilder
   * @description Please use {@link TypeBuilder.config}.
   */
  conf(): TypeBuilder;
  /**
   * @deprecated since version 0.0.19
   * @method config
   * @param config 노드 설정 값 (없을 시 기본 값으로 설정됩니다.)
   * @returns {TypeBuilder} Returns a TypeBuilder
   * @description Please use {@link TypeBuilder.config}.
   */
  conf(config: RecursivePartial<OmitNodesOptions>): TypeBuilder;
  conf(
    config: RecursivePartial<OmitNodesOptions> = DEFAULT_CONFIG,
  ): TypeBuilder {
    deprecatedMessage('0.0.19', 'config');

    if (config) recursiveConfigApply(this._config, config);

    const style = getCursorStyle(this._config.style.cursor, this.name, true);
    initializeTypozStyle(style);
    this.typeNode.setAttribute('typoz-node-builder-id', '' + this.id);
    this.typeNode.setAttribute('typoz-node-builder-name', this.name);
    this.typeNode.setAttribute('typoz-node-builder', '');
    this.typeNode.setAttribute('typoz-processed', '');
    this.typeNode.innerHTML = '';
    return this;
  }

  /**
   * @method config 노드 설정 변경
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  config(): TypeBuilder;
  /**
   * @method config 노드 설정 변경
   * @param config 노드 설정 값 (없을 시 기본 값으로 설정됩니다.)
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  config(config: RecursivePartial<OmitNodesOptions>): TypeBuilder;
  config(
    config: RecursivePartial<OmitNodesOptions> = DEFAULT_CONFIG,
  ): TypeBuilder {
    if (config) recursiveConfigApply(this._config, config);

    const style = getCursorStyle(this._config.style.cursor, this.name, true);
    initializeTypozStyle(style);
    this.typeNode.setAttribute('typoz-node-builder-id', '' + this.id);
    this.typeNode.setAttribute('typoz-node-builder-name', this.name);
    this.typeNode.setAttribute('typoz-node-builder', '');
    this.typeNode.setAttribute('typoz-processed', '');
    this.typeNode.innerHTML = '';
    return this;
  }

  /**
   * @deprecated since version 0.0.19
   * @private
   * @method getCurrentRenderContentLength
   * @returns {number} Returns the number of current render content
   */
  private getCurrentRenderContentLength() {
    deprecatedMessage('0.0.19');
    return this.content.length;
  }

  /**
   * @private
   * @method cursorUpdate 커서 위치 업데이트
   * @param {number} value 커서 위치 인덱스
   */
  private cursorUpdate(value: number) {
    if (
      this.pointer + value >= 0 &&
      this.pointer + value <= this.content.length
    )
      this.pointer += value;
  }

  /**
   * @method pause 타이핑 일시정지 메서드
   * @param {number} sec 휴식 시간
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  pause(sec: number): TypeBuilder {
    this.addTask(async () => {
      return await this.wait(sec * 1000);
    });
    return this;
  }

  /**
   * @private
   * @method commonWrite 한글 외 단어 쓰기
   * @param {string} letter 한글 외 단어
   */
  private commonWrite(letter: string) {
    this.addTask(async () => {
      this.content = this.content
        .slice(0, this.pointer)
        .concat(letter)
        .concat(this.content.slice(this.pointer));
      // this.content.splice(this.pointer, 0, letter);
      this.cursorUpdate(1);
      this.renderContent();
      return await this.wait((1 / this._config.speed.write) * 100);
    });
  }

  addplace(point: number, word: string): TypeBuilder {
    this.addTask(async () => {
      this.content = this.content
        .slice(0, this.pointer)
        .concat(word)
        .concat(this.content.slice(this.pointer));
      this.cursorUpdate(point);
      this.renderContent();
      return await this.wait((1 / this._config.speed.write) * 100);
    });
    return this;
  }

  replace(point: number, word: string): TypeBuilder {
    this.addTask(async () => {
      this.content.splice(this.pointer, 1, word);
      this.cursorUpdate(point);
      this.renderContent();
      return await this.wait((1 / this._config.speed.write) * 100);
    });
    return this;
  }

  /**
   * @method write 쓰기
   * @param {string} word 단어 또는 문장
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  write(word: string): TypeBuilder;
  /**
   * @method write 쓰기
   * @param {string} word 단어 또는 문장
   * @param {number} [speed] 쓰기 속도
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  write(word: string, speed: number): TypeBuilder;
  write(word: string, speed?: number): TypeBuilder {
    for (const letter of word) {
      if (this.parser.koreanParser.isKorean(letter)) {
        const parsedKoreanLetter = this.parser.categorizing(letter);
        const typingFlows = this.parser.getTypingFlow(parsedKoreanLetter)[0];
        for (let i = 0; i < typingFlows.length; i++) {
          const letters = typingFlows[i];
          if (i === 0) {
            this.addTask(async () => {
              this.content = this.content
                .slice(0, this.pointer)
                .concat(letters)
                .concat(this.content.slice(this.pointer));
              this.renderContent();
              return await this.wait(
                speed
                  ? (1 / speed) * 100
                  : (1 / this._config.speed.write) * 100,
              );
            });
          } else {
            this.addTask(async () => {
              this.content.splice(this.pointer, 1, letters);
              this.renderContent();
              return await this.wait(
                speed
                  ? (1 / speed) * 100
                  : (1 / this._config.speed.write) * 100,
              );
            });
          }
        }
        this.addTask(async () => {
          this.cursorUpdate(1);
          this.renderContent();
          return await this.wait(
            speed ? (1 / speed) * 100 : (1 / this._config.speed.write) * 100,
          );
        });
      } else {
        this.commonWrite(letter);
      }
    }
    return this;
  }

  /**
   * @method erase 지우기
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write('test content')
   *   .erase() // delete "t"
   *   .erase(6, 3) // delete "conten", speed 3
   *   .write('value')
   *   .run();
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  erase(): TypeBuilder;
  /**
   * @method erase 지우기
   * @param {number} [value=1] 지우기 갯수
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write('test content')
   *   .erase() // delete "t"
   *   .erase(6, 3) // delete "conten", speed 3
   *   .write('value')
   *   .run();
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  erase(/** @default 1 */ value: number): TypeBuilder;
  /**
   * @method erase 지우기
   * @param {number} [value=1] 지우기 갯수
   * @param {number} [speed] 지우기 속도
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write('test content')
   *   .erase() // delete "t"
   *   .erase(6, 3) // delete "conten", speed 3
   *   .write('value')
   *   .run();
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  erase(/** @default 1 */ value: number, speed: number): TypeBuilder;
  erase(/** @default 1 */ value: number = 1, speed?: number): TypeBuilder {
    for (let i = 0; i < value; i++) {
      this.addTask(async () => {
        this.cursorUpdate(-1);
        this.content.splice(this.pointer, 1);
        this.renderContent();
        return await this.wait(
          speed
            ? (1 / speed) * 100
            : (1 / (this._config.speed.erase / 2)) * 100,
        );
      });
    }
    return this;
  }

  /**
   * @method allErase 모두 지우기
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write('test content')
   *   .allErase() // delete "test content"
   *   .write('value') // write "value"
   *   .run(); // the last sentence is "vaule"
   * const builder2 = typoz.node().select("#target2").config();
   * builder2
   *   .write('test content2')
   *   .allErase(3) // delete "test content", speed 3
   *   .write('value') // write "value"
   *   .run(); // the last sentence is "vaule"
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  allErase(): TypeBuilder;
  /**
   * @method allErase 모두 지우기
   * @param {number} [speed] 지우기 속도
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write('test content')
   *   .allErase() // delete "test content"
   *   .write('value') // write "value"
   *   .run(); // the last sentence is "vaule"
   * const builder2 = typoz.node().select("#target2").config();
   * builder2
   *   .write('test content2')
   *   .allErase(3) // delete "test content", speed 3
   *   .write('value') // write "value"
   *   .run(); // the last sentence is "vaule"
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  allErase(speed: number): TypeBuilder;
  allErase(speed?: number): TypeBuilder {
    this.addTask(async () => {
      while (this.content.length > 0) {
        this.cursorUpdate(-1);
        this.content.pop();
        this.renderContent();
        await this.wait(
          speed
            ? (1 / (speed / 2) / 5) * 100
            : (1 / (this._config.speed.erase / 2) / 5) * 100,
        );
      }
      return speed
        ? (1 / (speed / 2) / 5) * 100
        : (1 / (this._config.speed.erase / 2) / 5) * 100;
    });
    return this;
  }

  /**
   * @method move 현재 위치에서 커서 이동
   * @param {number} value 커서 이동 수
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write("test")
   *   .move(-4)
   *   .write("my ")
   *   .move(4, 2) move left 4 words, speed 2
   *   .write("content")
   *   .run(); // the last sentence is "my test content"
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  move(value: number): TypeBuilder;
  /**
   * @method move 현재 위치에서 커서 이동
   * @param {number} value 커서 이동 수
   * @param {number} [speed] 커서 이동 속도
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write("test")
   *   .move(-4)
   *   .write("my ")
   *   .move(4, 2) move left 4 words, speed 2
   *   .write("content")
   *   .run(); // the last sentence is "my test content"
   * @returns {TypeBuilder} Returns a TypeBuilder
   */
  move(value: number, speed: number): TypeBuilder;
  move(value: number, speed?: number): TypeBuilder {
    const abs = Math.abs(value);
    const amount = Math.floor(Math.abs(value) / value);
    for (let i = 0; i < abs; i++) {
      this.addTask(async () => {
        this.cursorUpdate(amount);
        this.renderContent();
        return await this.wait(
          speed ? (1 / speed) * 100 : this._config.delay * 100,
        );
      });
    }
    return this;
  }

  /**
   * @private
   * @method addTask 작업 추가
   * @param task 타입빌더 작업 함수
   */
  private addTask(task: Task) {
    this.taskQueue.push(task);
  }

  /**
   * @async
   * @method run 렌더링을 1회 실행
   * @description 렌더링 후 정지합니다.
   */
  async run() {
    for (const task of this.taskQueue) {
      if (this.stop) {
        break;
      }
      if (this.pauseSignal) {
        await this.pausePromise;
      }
      await task();
    }
  }

  /**
   * @async
   * @method forever 렌더링을 무한으로 실행
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write("test")
   *   .forever(); // with erase motion
   * const builder2 = typoz.node().select("#target").config();
   * builder2
   *   .write("test")
   *   .forever(true); // without erase motion
   * @returns {Promise<void>}
   */
  async forever(): Promise<void>;
  /**
   * @async
   * @method forever 렌더링을 무한으로 실행
   * @param {boolean} [skipErase] 지우기 모션 여부
   * @example
   * const builder1 = typoz.node().select("#target").config();
   * builder1
   *   .write("test")
   *   .forever(); // with erase motion
   * const builder2 = typoz.node().select("#target").config();
   * builder2
   *   .write("test")
   *   .forever(true); // without erase motion
   * @returns {Promise<void>}
   */
  async forever(/** @default false */ skipErase: boolean): Promise<void>;
  async forever(
    /** @default false */ skipErase: boolean = false,
  ): Promise<void> {
    for (const task of this.taskQueue) {
      if (this.stop) {
        return;
      }
      if (this.pauseSignal) {
        await this.pausePromise;
      }
      await task();
    }
    await this.wait(this._config.delay * 1000);
    if (skipErase) {
      this.pointer = 0;
      this.content = [];
      this.renderContent();
    } else {
      while (this.content.length > 0) {
        this.cursorUpdate(-1);
        this.content.pop();
        this.renderContent();
        await this.wait((1 / (this._config.speed.erase / 2) / 5) * 100);
      }
      await this.wait(this._config.delay * 1000);
    }

    this.forever(skipErase);
  }

  /**
   * @private
   * @method renderContent content에 담긴 텍스트 렌더링
   * See {@link TypeBuilder.content}
   */
  private renderContent() {
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

  /**
   * @method destroy 타입빌더 해제 및 초기화
   */
  destroy() {
    this.stop = true;
    this.taskQueue = [];
    this.typeNode.innerHTML = this.originContent;
    delete this.typeNode['typings'];
    delete this.typeNode['typozConfig'];
  }
}
