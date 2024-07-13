/**
 * @jest-environment jsdom
 */
import Typoz, { KoreanParser, Parser } from '../src/index.js';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
describe('[TYPOZ 기능 테스트]', () => {
    let typoz;
    beforeAll(() => {
        typoz = new Typoz();
    });
    it('[버전 테스트]', async () => {
        const pkg = await import('../package.json');
        expect(Typoz.version()).toStrictEqual(pkg.version);
    });
    describe('[정의 테스트]', () => {
        beforeEach(() => {
            typoz.initialize();
        });
        it('인스턴스 정의 테스트', () => {
            expect(typoz).toBeDefined();
        });
    });
    describe('[설정 테스트] config', () => {
        beforeEach(() => {
            typoz.initialize();
        });
        it('[설정 확인] 기본 값이 출력된다.', () => {
            expect(typoz.config.mode.realTyping).toBeFalsy();
            expect(typoz.config.speed.write).toStrictEqual(1);
        });
        it('[설정 확인] 임의 값을 넣으면 변경된다', () => {
            typoz.globalConfig({
                mode: {
                    erase: false,
                },
                speed: {
                    write: 3,
                },
            });
            expect(typoz.config.mode.erase).toBeFalsy();
            expect(typoz.config.mode.divide).toBeTruthy();
            expect(typoz.config.speed.write).toStrictEqual(3);
            expect(typoz.config.speed.erase).toStrictEqual(5);
        });
    });
    describe('[한글 분석 테스트]', () => {
        // beforeEach(() => {
        //   typoz.initialize();
        // });
        describe('[한글 분석기] KoreanParser', () => {
            it('[한글 판별] isKorean --- 한글인지 판별', () => {
                const krParser = new KoreanParser();
                expect(krParser.isKorean('가')).toBeTruthy();
                expect(krParser.isKorean('ㄷ')).toBeTruthy();
            });
            it('[한글 판별] isKorean --- 한글이 아니면 Falsy', () => {
                const krParser = new KoreanParser();
                expect(krParser.isKorean('ee')).toBeFalsy();
                expect(krParser.isKorean('123')).toBeFalsy();
            });
            it('[한글 판별] onsetIndex, getOnset --- 자음 위치 값, 한글 자음 추출', () => {
                const krParser = new KoreanParser();
                expect(krParser.onsetIndex('가')).toStrictEqual(0);
                expect(krParser.getOnset('가')).toStrictEqual('ㄱ');
                expect(krParser.getOnset('하')).toStrictEqual('ㅎ');
                expect(krParser.getOnset('간')).toStrictEqual('ㄱ');
                expect(krParser.getOnset('깋')).toStrictEqual('ㄱ');
            });
            it('[한글 판별] nucleusIndex, getNucleus --- 모음 위치 값, 한글 모음 추출', () => {
                const krParser = new KoreanParser();
                expect(krParser.nucleusIndex('가')).toStrictEqual(0);
                expect(krParser.nucleusIndex('하')).toStrictEqual(0);
                expect(krParser.nucleusIndex('개')).toStrictEqual(1);
                expect(krParser.nucleusIndex('객')).toStrictEqual(1);
                expect(krParser.getNucleus('가')).toStrictEqual('ㅏ');
                expect(krParser.getNucleus('하')).toStrictEqual('ㅏ');
                expect(krParser.getNucleus('간')).toStrictEqual('ㅏ');
                expect(krParser.getNucleus('깋')).toStrictEqual('ㅣ');
                expect(krParser.getNucleus('객')).toStrictEqual('ㅐ');
            });
            it('[한글 판별] codaIndex, getCoda --- 받침 위치 값, 한글 받침 추출', () => {
                const krParser = new KoreanParser();
                expect(krParser.codeIndex('가')).toStrictEqual(0);
                expect(krParser.codeIndex('각')).toStrictEqual(1);
                expect(krParser.codeIndex('갛')).toStrictEqual(27);
                expect(krParser.getCoda('갛')).toStrictEqual('ㅎ');
                expect(krParser.getCoda('깋')).toStrictEqual('ㅎ');
            });
            it('[한글 판별] wordToLettersWithEmpty --- 글자 분해 배열 추출', () => {
                const krParser = new KoreanParser();
                expect(krParser.wordToLettersWithEmpty('가')).toStrictEqual([
                    'ㄱ',
                    'ㅏ',
                    '',
                ]);
                expect(krParser.wordToLetters('가')).toStrictEqual(['ㄱ', 'ㅏ']);
            });
            it('[한글 판별] wordToLetters --- 한글 인자 값만 허용', () => {
                const krParser = new KoreanParser();
                expect(() => krParser.wordToLetters('123123')).toThrow(new TypeError('required only korean.'));
            });
            it('[한글 판별] getWordCode --- 음소 코드 합계', () => {
                const krParser = new KoreanParser();
                expect(krParser.getWordCode(['ㄱ', 'ㅏ'])).toStrictEqual(44032);
                expect(krParser.getWordCode(['ㄱ', 'ㅐ'])).toStrictEqual(44060);
                expect(krParser.getWordCode(['ㄱ', 'ㅐ', 'ㅎ'])).toStrictEqual(44087);
            });
            it('[한글 판별] letterToWord --- 음소 재조합 문자 추출', () => {
                const krParser = new KoreanParser();
                expect(krParser.lettersToWord(['ㄱ', 'ㅏ'])).toStrictEqual('가');
                expect(krParser.lettersToWord(['ㄱ', 'ㅐ'])).toStrictEqual('개');
                expect(krParser.lettersToWord(['ㄱ', 'ㅐ', 'ㅎ'])).toStrictEqual('갷');
            });
        });
        describe('[상위 분석기 테스트]', () => {
            it('[한글 분해/분류] 수, 한글 분류', () => {
                const parser = new Parser();
                expect(parser.categorizing('123안녕하세요')).toStrictEqual([
                    ['1'],
                    ['2'],
                    ['3'],
                    ['ㅇ', 'ㅏ', 'ㄴ'],
                    ['ㄴ', 'ㅕ', 'ㅇ'],
                    ['ㅎ', 'ㅏ'],
                    ['ㅅ', 'ㅔ'],
                    ['ㅇ', 'ㅛ'],
                ]);
                expect(parser.categorizing('안녕하세요')).toStrictEqual([
                    ['ㅇ', 'ㅏ', 'ㄴ'],
                    ['ㄴ', 'ㅕ', 'ㅇ'],
                    ['ㅎ', 'ㅏ'],
                    ['ㅅ', 'ㅔ'],
                    ['ㅇ', 'ㅛ'],
                ]);
            });
            it('[한글 분해/분류] 빈 문자열을 포함한 분류', () => {
                const parser = new Parser();
                expect(parser.categorizingWithEmpty('123안녕하세요')).toStrictEqual([
                    ['1', '', ''],
                    ['2', '', ''],
                    ['3', '', ''],
                    ['ㅇ', 'ㅏ', 'ㄴ'],
                    ['ㄴ', 'ㅕ', 'ㅇ'],
                    ['ㅎ', 'ㅏ', ''],
                    ['ㅅ', 'ㅔ', ''],
                    ['ㅇ', 'ㅛ', ''],
                ]);
            });
            it('[한글 분해/분류] 띄어쓰기 포함한 분류', () => {
                const parser = new Parser();
                expect(parser.categorizing('안녕하세요 123')).toStrictEqual([
                    ['ㅇ', 'ㅏ', 'ㄴ'],
                    ['ㄴ', 'ㅕ', 'ㅇ'],
                    ['ㅎ', 'ㅏ'],
                    ['ㅅ', 'ㅔ'],
                    ['ㅇ', 'ㅛ'],
                    [' '],
                    ['1'],
                    ['2'],
                    ['3'],
                ]);
            });
            it('[한글 분해/분류] 문장의 양 끝단 빈 공간 제거', () => {
                const parser = new Parser();
                expect(parser.categorizing('안녕하세요 ')).toStrictEqual([
                    ['ㅇ', 'ㅏ', 'ㄴ'],
                    ['ㄴ', 'ㅕ', 'ㅇ'],
                    ['ㅎ', 'ㅏ'],
                    ['ㅅ', 'ㅔ'],
                    ['ㅇ', 'ㅛ'],
                ]);
            });
            it('[한글 분해/분류] 빈 문자열은 빈 배열 반환', () => {
                const parser = new Parser();
                expect(parser.parse('')).toStrictEqual([]);
            });
            it('[한글 분해/분류] 음소 재조합 문자와 문자 분해 음소 배열', () => {
                const parser = new Parser();
                expect(parser.koreanParser.lettersToWord(['ㄴ', 'ㅕ'])).toStrictEqual('녀');
                expect(parser.parse('안녕')).toStrictEqual([
                    ['ㅇ', '아', '안'],
                    ['ㄴ', '녀', '녕'],
                ]);
            });
            it('[한글 분해/분류] 영문, 한글, 띄어쓰기', () => {
                const parser = new Parser();
                expect(parser.parse('parse 테스트')).toStrictEqual([
                    ['p'],
                    ['a'],
                    ['r'],
                    ['s'],
                    ['e'],
                    [' '],
                    ['ㅌ', '테'],
                    ['ㅅ', '스'],
                    ['ㅌ', '트'],
                ]);
            });
        });
    });
});
//# sourceMappingURL=typoz.spec.js.map