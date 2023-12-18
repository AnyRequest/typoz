# Typos

**`Typos`**는 Typography의 어원인 typ과 -술을 의미하는 접미사 graphy의 합성어에서 그리스어의 두 단어 τύπος(`typos`, 표시)에서 따온 이름입니다. 사용자가 직접 타이핑하는 효과를 주고, 다양한 효과를 쉽게 조작하기 위해 제작되었습니다.

## Version

current version v0.0.11

## Typos의 한글 분해, 조합

`음소` -> `음절` \[조합\], `음절` -> `음소` \[분해\] 하며, 한글을 입력할 때 나타나는 자모의 조합 효과를 그대로 재현합니다.

## Installation

```bash
npm install anyrequest/typoz
pnpm add anyrequest/typoz
```

## CDN

```html
<script src="https://www.unpkg.com/typoz@0.0.11/umd/typoz.min.js"></script>
```

## Congifuration

```javascript
import Typoz from 'typoz';
// or import { Typoz } from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig(/* custom configs */);
```

## TypeNodeBuilder

### How to use

```javascript
import Typoz from 'typoz';

const typoz = new Typoz();
typoz
  .node()
  .select('#test')
  .conf(/* custom configs */)
  .write('Write the entire text')
  .write(' ')
  .write('o')
  .write('r')
  .write(' ')
  .write('type each character individually.')
  .write(' 한글과 영어')
  .pause(1)
  .erase()
  .erase()
  .write('숫자')
  .pause(1)
  .erase()
  .erase()
  .write('여러 문자 등 작성 가능합니다.')
  .run();
```

## License

[MIT](https://github.com/AnyRequest/typoz/blob/main/LICENSE)

## Author

| [devkimson](https://github.com/kkn1125)                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.githubusercontent.com/u/71887242?v=4" alt="avatar" width="100" style="border-radius: 9999999999px" /> |
