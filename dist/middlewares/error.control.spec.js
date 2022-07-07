import { errorControl } from './error.control';
let req;
let resp;
let next;
let error;
beforeEach(() => {
    (resp = { send: jest.fn(), status: jest.fn() }),
        (error = {
            name: 'UserAuthorizationError',
            message: 'test',
        });
});
describe('Given the errorControl', () => {
    describe('When have a error', () => {
        test('Then resp.status is called', () => {
            errorControl(error, req, resp, next);
            expect(resp.status).toHaveBeenCalled();
        });
        test('Then resp.status is called', () => {
            errorControl(error, req, resp, next);
            expect(resp.status).toHaveBeenCalled();
        });
        test('should first', () => {
            errorControl({}, req, resp, next);
            expect(resp.status).toHaveBeenCalled();
        });
    });
});
