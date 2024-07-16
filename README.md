# Typoz

`Typoz`는 '타입(type)'과 'oz(온스)'의 결합으로, 다양한 타이핑 효과를 제공하는 라이브러리입니다.

## Version

`v0.1.2`

## Typoz의 한글 분해, 조합

`음소` -> `음절` \[조합\], `음절` -> `음소` \[분해\] 하며, 한글을 입력할 때 나타나는 자모의 조합 효과를 그대로 재현합니다.

## Installation

```bash
npm install typoz
pnpm add typoz
```

## CDN

```html
<script src="https://www.unpkg.com/typoz@0.1.2/umd/typoz.min.js"></script>
```

## Congifuration

```javascript
import Typoz from 'typoz';
// or import { Typoz } from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig(/* custom configs */);
```

## How to use

기본적으로 제공되는 `typoz`의 기능은 크게 세 가지입니다.

1. 지정된 클래스명(.typoz)를 탐색하고 자동 렌더링
2. 특정 `id` 또는 `class`값으로 지정하여 렌더링
3. 빌더를 이용한 세부적인 타이핑 제어

### Util (since 0.1.1)

버전 0.1.1부터 유틸리티가 추가됩니다.

- 한글 자음으로 한국어 키워드를 검색할 수 있습니다.
- 명사에 적합한 조사를 자동으로 부여할 수 있습니다.
  - 예시) 라면, 사과... => 라면과 사과와...
- 적합하지 않은 조사를 검증하고 올바른 조사를 찾을 수 있습니다.
  - 예시) 라면와 => 라면과
- 동사, 형용사를 변환합니다.
  - 예시) verb + ~서: 무르다 => 물러, 돕다 => 도와, 무찌르다 => 무찔러

### Usage

```html
<!-- 기본적으로 클래스명 typoz를 탐색하고 자동 실행합니다. -->
<div class="typoz">테스트 내용 타이핑 효과.</div>
```

```javascript
import Typoz from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig();
```

#### Manual rendering

```html
<!-- 기본적으로 클래스명 typoz를 탐색하고 자동 실행합니다. -->
<div class="typoz">테스트 내용 타이핑 효과.</div>
```

```javascript
import Typoz from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig({
  autoRender: false,
});

typoz.render();
```

#### Add TypeNode

원하는 타이핑을 추가로 작성하고 개별/전역 설정을 할 수 있습니다.

```javascript
import Typoz from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig({
  speed: { write: 1 },
  nodes: [
    {
      select: '#target1',
      words: ['또 다른 텍스트 입력'],
      config: {
        speed: { write: 5 },
      },
    },
  ],
});
```

#### Add render element

원하는 타이핑을 추가로 작성하고 개별/전역 설정을 할 수 있습니다.

```javascript
import Typoz from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig({
  autoRender: false,
  speed: { write: 1 },
});

const myElements = document.querySelectorAll('.test');
typoz.render(myElements);

// or

const myElement = document.querySelector('.test');
typoz.render([myElement]);
```

### TypeNodeBuilder

빌더를 이용해 원하는 타이핑 효과를 제어할 수 있습니다. 빌더는 `TypeNode`를 렌더링하는 방식과 달리 개별 단위로 실행합니다. 메서드 행위는 아래와 같습니다.

- createBuilder(): 빌더 인스턴스를 얻습니다. (✨ since v0.1.0)
- node(): (deprecated) 빌더 인스턴스를 얻습니다. (since v0.1.0)
- select(idOrClass: string): 타겟을 지정합니다.
- conf(config: Options): Typoz의 config와 동일한 포멧입니다.
- write(word: string): 현재 커서에서 한글, 영문, 숫자 등 모든 문자를 단일 또는 문자열을 입력합니다.
- move(value: number): value값 만큼 커서를 이동합니다.
- pause(value: number): value값 만큼 휴식합니다.
- erase(): 현재 커서에서 글자를 지웁니다.
- run(): 지정한 흐름으로 한 번 실행한 후 완료 시 멈춥니다.
- forever(skipErase: boolean = false): 지정한 흐름으로 무한 실행합니다. skipErase는 기본 false 값이며, true일 시 지우기 모션 없이 실행됩니다.
- pauseRender(): 렌더링을 일시정지합니다. (✨ since v0.1.0)
- resumeRender(): 렌더링을 재개합니다. (✨ since v0.1.0)

```javascript
const typoz = new Typoz();
typoz
  .createBuilder()
  .select('#test')
  // .conf(/* custom configs */) // deprecated
  .config(/* custom configs */)
  .write('Write the entire text')
  .write(' ')
  .write('r')
  .move(-1)
  .write('o')
  .move(2)
  .write(' ')
  .write('type each character individually.')
  .pause(1)
  .write('지울내용')
  .erase()
  .erase()
  .erase()
  .erase()
  .pause(1)
  .write('여러 문자 등 작성 가능합니다.')
  .run();
```

### TypeNodeBuilder: loop with erase motion

지우기 모션이 포함된 무한 루프 실행 예시입니다.

```javascript
const typoz = new Typoz();
typoz
  .createBuilder()
  .select('#test')
  // .conf(/* custom configs */) // deprecated
  .config(/* custom configs */)
  .write('Write the entire text')
  .forever();
```

### TypeNodeBuilder: loop without erase motion

지우기 모션이 제거된 무한 루프 실행 예시입니다.

```javascript
const typoz = new Typoz();
typoz
  .createBuilder()
  .select('#test')
  // .conf(/* custom configs */) // deprecated
  .config(/* custom configs */)
  .write('여러 문자 등 작성 가능합니다.')
  .forever(true);
```

## License

[MIT](https://github.com/AnyRequest/typoz/blob/main/LICENSE)

## Author

| [devkimson](https://github.com/kkn1125)                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.githubusercontent.com/u/71887242?v=4" alt="avatar" width="100" style="border-radius: 9999999999px" /> |
