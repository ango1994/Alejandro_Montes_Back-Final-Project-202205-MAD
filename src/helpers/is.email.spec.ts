import { isEmail } from './is.email';

describe('Given a function isEmail', () => {
    describe('When it is called', () => {
        it('It should call compare', () => {
            expect(isEmail('test')).toBe(false);
        });
    });
    describe('When it is called', () => {
        it('It should call compare', () => {
            expect(isEmail('test@test.com')).toBe(true);
        });
    });
});
