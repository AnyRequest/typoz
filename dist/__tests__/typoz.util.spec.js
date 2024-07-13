import Typoz, { Util } from '../src/index.js';
import { describe, expect, it } from 'vitest';
describe('Typoz Util Test', () => {
    describe('[단어 유틸 테스트] splitIndex, splitIndexes', () => {
        it('[단어 그룹 자르기] splitIndex', () => {
            const typoz = new Typoz();
            expect(typoz.util.splitIndex('감사합니다', 2)).toStrictEqual([
                '감사',
                '합니다',
            ]);
            expect(typoz.util.splitIndex('감사', 0)).toStrictEqual(['감사']);
        });
        it('[단어 그룹 자르기 Fail] splitIndex', () => {
            const typoz = new Typoz();
            expect(typoz.util.splitIndex.bind(this, '감사', 3)).toThrow();
            expect(typoz.util.splitIndex.bind(this, '감사', 3)).toThrowError(new RangeError('too much index'));
        });
        it('[단어 그룹 연속 자르기] splitIndex', () => {
            const typoz = new Typoz();
            expect(typoz.util.splitIndexes('감사합니다', 2, 1, 1)).toStrictEqual([
                '감사',
                '합',
                '니',
                '다',
            ]);
            expect(typoz.util.splitIndexes('감사', 0, 2)).toStrictEqual(['감사']);
        });
    });
    /* 타이포즈 유틸 조사 테스트 */
    describe('[조사 테스트] josa, josaWith and josaAnd', () => {
        it('[조사 변환] josa --- el rl', () => {
            const typoz = new Typoz();
            expect(typoz.util.josa('안녕', Util.Josa.ElRl)).toStrictEqual('안녕을');
            expect(typoz.util.josa('이나', Util.Josa.ElRl)).toStrictEqual('이나를');
        });
        it('[조사 변환] josa --- ei ga', () => {
            const typoz = new Typoz();
            expect(typoz.util.josa('만두', Util.Josa.EiGa)).toStrictEqual('만두가');
            expect(typoz.util.josa('배럴', Util.Josa.EiGa)).toStrictEqual('배럴이');
        });
        it('[조사 변환] josa --- en nn', () => {
            const typoz = new Typoz();
            expect(typoz.util.josa('만두', Util.Josa.EnNn)).toStrictEqual('만두는');
            expect(typoz.util.josa('배럴', Util.Josa.EnNn)).toStrictEqual('배럴은');
        });
        it('[조사 변환] josa --- gwa wa', () => {
            const typoz = new Typoz();
            expect(typoz.util.josa('만두', Util.Josa.GwaWa)).toStrictEqual('만두와');
            expect(typoz.util.josa('배럴', Util.Josa.GwaWa)).toStrictEqual('배럴과');
        });
        it('[조사 다중 변환] josaWith --- only gwa wa', () => {
            const typoz = new Typoz();
            expect(typoz.util.josaWith(['만두', '청포도', '종이', '교련'], Util.Josa.GwaWa)).toStrictEqual('만두와 청포도와 종이와 교련');
            expect(typoz.util.josaWith(['배럴', '청포도', '가면', '나무'], Util.Josa.GwaWa)).toStrictEqual('배럴과 청포도와 가면과 나무');
        });
        it('[조사, 그리고 변환] josaAnd --- gwa wa 여러 단어', () => {
            const typoz = new Typoz();
            expect(typoz.util.josaAnd(['만두', '청포도', '종이', '교련'], Util.Josa.GwaWa)).toStrictEqual('만두와 청포도와 종이, 그리고 교련');
            expect(typoz.util.josaAnd(['배럴', '청포도', '가면', '나무'], Util.Josa.GwaWa)).toStrictEqual('배럴과 청포도와 가면, 그리고 나무');
        });
        it('[조사, 그리고 변환] josaAnd --- gwa wa 2 단어', () => {
            const typoz = new Typoz();
            expect(typoz.util.josaAnd(['만두', '청포도'], Util.Josa.GwaWa)).toStrictEqual('만두, 그리고 청포도');
            expect(typoz.util.josaAnd(['배럴', '청포도'], Util.Josa.GwaWa)).toStrictEqual('배럴, 그리고 청포도');
        });
    });
    /* 타이포즈 유틸 한국어 검색 테스트 */
    describe('[한글 검색] searchKorean', () => {
        it('[자음 검색] searchByOnset --- Only 한글 검색 : 1 개', () => {
            const typoz = new Typoz();
            const founded = typoz.util.searchByOnset(['라면', '꼰대', '마리아', '마리아디비', '저스티스'], 'ㄹㅁ');
            expect(founded.length).toStrictEqual(1);
        });
        it('[자음 검색] searchByOnset --- Only 한글 검색 : 2 개', () => {
            const typoz = new Typoz();
            const founded = typoz.util.searchByOnset(['라면', '꼰대', '마리아', '마리아디비', '저스티스'], 'ㅁㄹㅇ');
            expect(founded.length).toStrictEqual(2);
        });
        it('[자음 검색] searchByOnset --- Only 한글 검색 : 0 개', () => {
            const typoz = new Typoz();
            const founded = typoz.util.searchByOnset(['라면', '꼰대', '마리아', '마리아디비', '저스티스'], 'ㅁㅈㅂ');
            expect(founded.length).toStrictEqual(0);
        });
        it('[자음 검색] searchByOnset --- Only 한글 검색 : 실패', () => {
            const typoz = new Typoz();
            const foundFeature = ({ withThrow }) => typoz.util.searchByOnset(['라면', '꼰대', '마리아', '마리아디비', 'justice'], 'ㅁㅈㅂ', {
                withThrow,
            });
            expect(foundFeature.bind(this, { withThrow: true })).toThrow();
            expect(foundFeature.bind(this, { withThrow: true })).toThrowError('word is not korean');
            try {
                foundFeature({ withThrow: true });
            }
            catch (error) {
                expect(error.cause).toStrictEqual('word: justice');
            }
            expect(foundFeature({ withThrow: false })).toStrictEqual([]);
        });
        it('[자음 검색] searchByOnset --- Only 한글 검색 : 3 개', () => {
            const typoz = new Typoz();
            const founded = typoz.util.searchByOnset(['라면', '꼰대', '마리아', '마리아디비', 'justice'], 'ㅁ');
            expect(founded.length).toStrictEqual(3);
        });
        it.todo('동사 처리 필요');
    });
    describe('[동사 변환] verbToContinue', () => {
        it('[연결 규칙] verbToContinue --- -르다 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('기르다')).toStrictEqual('길러');
            expect(typoz.util.verbToContinue('주무르다')).toStrictEqual('주물러');
            expect(typoz.util.verbToContinue('모르다')).toStrictEqual('몰라');
            expect(typoz.util.verbToContinue('다르다')).toStrictEqual('달라');
        });
        it('[연결 규칙] verbToContinue --- -ㅣ다 => ㅕ 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('미치다')).toStrictEqual('미쳐');
            expect(typoz.util.verbToContinue('점치다')).toStrictEqual('점쳐');
        });
        it('[연결 규칙] verbToContinue --- -ㅗ ㅏ ㅘ다 => 아 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('졸다')).toStrictEqual('졸아');
            expect(typoz.util.verbToContinue('받다')).toStrictEqual('받아');
            expect(typoz.util.verbToContinue('놀다')).toStrictEqual('놀아');
        });
        it('[연결 규칙] verbToContinue --- -ㅜ ㅚ ㅡ(ㅅ받침)다 => 어 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('괴다')).toStrictEqual('괴어');
            expect(typoz.util.verbToContinue('긋다')).toStrictEqual('그어');
        });
        it('[연결 규칙] verbToContinue --- -ㅜ ㅚ다 => ㅝ 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('가누다')).toStrictEqual('가눠');
            expect(typoz.util.verbToContinue('겨누다')).toStrictEqual('겨눠');
            expect(typoz.util.verbToContinue('다루다')).toStrictEqual('다뤄');
            expect(typoz.util.verbToContinue('굽다')).toStrictEqual('구워');
            expect(typoz.util.verbToContinue('어둡다')).toStrictEqual('어두워');
        });
        it('[연결 규칙] verbToContinue --- -ㅗ(ㅂ받침)다 => 와 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('돕다')).toStrictEqual('도와');
            expect(typoz.util.verbToContinue('곱다')).toStrictEqual('고와');
        });
        it('[연결 규칙] verbToContinue --- -ㅏ(ㅂ받침)다 => 워 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('고맙다')).toStrictEqual('고마워');
            expect(typoz.util.verbToContinue('고깝다')).toStrictEqual('고까워');
            expect(typoz.util.verbToContinue('가깝다')).toStrictEqual('가까워');
        });
        it('[연결 규칙] verbToContinue --- -하다 규칙 테스트', () => {
            const typoz = new Typoz();
            expect(typoz.util.verbToContinue('주문하다')).toStrictEqual('주문해');
            expect(typoz.util.verbToContinue('고심하다')).toStrictEqual('고심해');
        });
    });
    describe('[오타 확인] checkOta', () => {
        it('[오타 검증] checkOta --- 단어 연결 검증', () => {
            const typoz = new Typoz();
            const checkOta1 = typoz.util.checkOta('가방와');
            const checkOta2 = typoz.util.checkOta('가방 와');
            expect(checkOta1[0]).toStrictEqual({
                problem: '가방와',
                index: 0,
                correct: '가방과',
            });
            expect(checkOta2[0]).toStrictEqual({
                problem: '와',
                index: 1,
                correct: '가방과',
                detail: '조사는 붙여써야 합니다.',
            });
        });
        it('[오타 검증] checkOta --- 문장 검증', () => {
            const typoz = new Typoz();
            const checkOta1 = typoz.util.checkOta('가방와 다른 점는');
            expect(checkOta1[0]).toStrictEqual({
                problem: '가방와',
                index: 0,
                correct: '가방과',
            });
            expect(checkOta1[1]).toStrictEqual({
                problem: '점는',
                index: 2,
                correct: '점은',
            });
        });
    });
});
//# sourceMappingURL=typoz.util.spec.js.map