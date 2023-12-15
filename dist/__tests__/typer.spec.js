import Typex, { KoreanParser, Parser } from '../src/index';
describe('[TYPER TEST]', () => {
    let typex;
    beforeAll(() => {
        typex = new Typex();
    });
    describe('[Defined Test]', () => {
        beforeEach(() => {
            typex.initialize();
        });
        it('✅ defined test', () => {
            expect(typex).toBeDefined();
        });
    });
    describe('[Configuration Test]', () => {
        beforeEach(() => {
            typex.initialize();
        });
        it('✅ default configuration check', () => {
            expect(typex.config.mode.realTyping).toBeFalsy();
            expect(typex.config.speed.write).toStrictEqual(1);
        });
        it('✅ custom configuration test', () => {
            typex.globalConfig({
                mode: {
                    erase: false,
                },
                speed: {
                    write: 3,
                },
            });
            expect(typex.config.mode.erase).toBeFalsy();
            expect(typex.config.mode.divide).toBeTruthy();
            expect(typex.config.speed.write).toStrictEqual(3);
            expect(typex.config.speed.erase).toStrictEqual(1);
        });
    });
    describe('[Parser Test]', () => {
        describe('[KoreanParser]', () => {
            it('✅ parse word success', () => {
                const krParser = new KoreanParser();
                expect(krParser.isKorean('가')).toBeTruthy();
                expect(krParser.isKorean('ㄷ')).toBeTruthy();
            });
            it('❌ parse word fail', () => {
                const krParser = new KoreanParser();
                expect(krParser.isKorean('ee')).toBeFalsy();
                expect(krParser.isKorean('123')).toBeFalsy();
            });
            it('✅ wordToLetters test: get onset', () => {
                const krParser = new KoreanParser();
                expect(krParser.onsetIndex('가')).toStrictEqual(0);
                expect(krParser.getOnset('가')).toStrictEqual('ㄱ');
                expect(krParser.getOnset('하')).toStrictEqual('ㅎ');
                expect(krParser.getOnset('간')).toStrictEqual('ㄱ');
                expect(krParser.getOnset('깋')).toStrictEqual('ㄱ');
            });
            it('✅ wordToLetters test: get nucleus', () => {
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
            it('✅ wordToLetters test: get coda', () => {
                const krParser = new KoreanParser();
                expect(krParser.codeIndex('가')).toStrictEqual(0);
                expect(krParser.codeIndex('각')).toStrictEqual(1);
                expect(krParser.codeIndex('갛')).toStrictEqual(27);
                expect(krParser.getCoda('갛')).toStrictEqual('ㅎ');
                expect(krParser.getCoda('깋')).toStrictEqual('ㅎ');
            });
            it('✅ wordToLetters test', () => {
                const krParser = new KoreanParser();
                expect(krParser.wordToLettersWithEmpty('가')).toStrictEqual([
                    'ㄱ',
                    'ㅏ',
                    '',
                ]);
                expect(krParser.wordToLetters('가')).toStrictEqual(['ㄱ', 'ㅏ']);
            });
            it('❌ wordToLetters test', () => {
                const krParser = new KoreanParser();
                expect(() => krParser.wordToLetters('123123')).toThrow(new TypeError('required only korean.'));
            });
            it('letters to word test: index', () => {
                const krParser = new KoreanParser();
                expect(krParser.getWordCode(['ㄱ', 'ㅏ'])).toStrictEqual(44032);
                expect(krParser.getWordCode(['ㄱ', 'ㅐ'])).toStrictEqual(44060);
                expect(krParser.getWordCode(['ㄱ', 'ㅐ', 'ㅎ'])).toStrictEqual(44087);
            });
            it('letters to word test: word', () => {
                const krParser = new KoreanParser();
                expect(krParser.lettersToWord(['ㄱ', 'ㅏ'])).toStrictEqual('가');
                expect(krParser.lettersToWord(['ㄱ', 'ㅐ'])).toStrictEqual('개');
                expect(krParser.lettersToWord(['ㄱ', 'ㅐ', 'ㅎ'])).toStrictEqual('갷');
            });
        });
        describe('[Parser Test]', () => {
            it('✅ sentence test', () => {
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
            it('✅ sentence test: with empty item', () => {
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
            it('✅ sentence test: empty between words', () => {
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
            it('✅ sentence test: empty trim', () => {
                const parser = new Parser();
                expect(parser.categorizing('안녕하세요 ')).toStrictEqual([
                    ['ㅇ', 'ㅏ', 'ㄴ'],
                    ['ㄴ', 'ㅕ', 'ㅇ'],
                    ['ㅎ', 'ㅏ'],
                    ['ㅅ', 'ㅔ'],
                    ['ㅇ', 'ㅛ'],
                ]);
            });
            it('✅ empty sentence test', () => {
                const parser = new Parser();
                expect(parser.parse('')).toStrictEqual([]);
            });
            it('✅ sentence test: three letters', () => {
                const parser = new Parser();
                expect(parser.koreanParser.lettersToWord(['ㄴ', 'ㅕ'])).toStrictEqual('녀');
                expect(parser.parse('안녕')).toStrictEqual([
                    ['ㅇ', '아', '안'],
                    ['ㄴ', '녀', '녕'],
                ]);
            });
            it('✅ sentence test eng + kor + empty', () => {
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
describe;
//# sourceMappingURL=typer.spec.js.map