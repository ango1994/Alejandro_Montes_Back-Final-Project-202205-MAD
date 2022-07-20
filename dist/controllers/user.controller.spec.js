import { User } from '../models/user.model';
import * as aut from '../services/authorization.js';
jest.mock('../services/authorization.js');
import { UserController } from './user.controller';
describe('Given a instantiated controller Usercontroller', () => {
    let controller;
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            params: { id: '123456789012345678901234' },
            body: { password: '234343', name: 'test' },
        };
        res = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
        controller = new UserController();
    });
    describe('When method getController is called with an invalid id', () => {
        test('Then res.send should be called', async () => {
            req = {
                params: { id: '12' },
            };
            await controller.getController(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method getController is called with a existing id', () => {
        test('Then res.send should be called', async () => {
            User.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ user: 'test' }),
            });
            await controller.getController(req, res, next);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({ user: 'test' }));
        });
    });
    describe('When method getController is called with a non existing id', () => {
        test('Then res.send should be called', async () => {
            User.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });
            await controller.getController(req, res, next);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({}));
        });
    });
    describe('When method postController is called and req.body dont satisfy the required params', () => {
        test('Then next should be called', async () => {
            await controller.postController(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method postController is called', () => {
        test('Then res.send should be called', async () => {
            User.create = jest.fn().mockResolvedValue({ test: 'test' });
            await controller.postController(req, res, next);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({ test: 'test' }));
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
    describe('When method loginController is called an invalid name or password', () => {
        test('Then res.send should be called P', async () => {
            User.findOne = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ user: 'test' }),
            });
            aut.compare.mockResolvedValue(false);
            await controller.loginController(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method loginController is called', () => {
        test('Then res.send should be called', async () => {
            User.findOne = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ user: 'test' }),
            });
            aut.compare.mockResolvedValue(true);
            aut.createToken.mockResolvedValue('234234234');
            await controller.loginController(req, res, next);
            expect(res.send).toHaveBeenCalled();
        });
    });
    describe('When method deleteController is called with a valid id', () => {
        test('Then an user should be deleted', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                tokenPayload: { id: '123456789012345678901234' },
            };
            const findUser = '123456789012345678901234';
            User.findById = jest.fn().mockResolvedValue(findUser);
            await controller.deleteController(req, res);
            expect(res.status).toBeCalledWith(202);
        });
    });
    describe('When method patchController is called with a invalid id', () => {
        test('Then an next should be called', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                tokenPayload: { _id: '1234567890123456789' },
            };
            await controller.patchController(req, res, next);
            expect(next).toBeCalled();
        });
    });
    describe('When method patchController is called with email in the body req', () => {
        test('Then next should be called', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                tokenPayload: { _id: '123456789012345678901234' },
                body: { name: 'test', email: 'test@test.com' },
            };
            const findUser = '123456789012345678901234';
            User.findById = jest.fn().mockResolvedValue(findUser);
            await controller.patchController(req, res, next);
            expect(next).toBeCalled();
        });
    });
    describe('When method patchController is called', () => {
        test.skip('Then an user should be patched', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                tokenPayload: { id: '123456789012345678901234' },
                body: { comic: '123456789012345678901234' },
            };
            User.findById = jest.fn().mockResolvedValue({
                comics: [
                    '123456789012345678901234',
                    '123456789012345678901235',
                ],
                save: jest.fn(),
            });
            await controller.patchController(req, res, next);
            expect(res.send).toBeCalled();
        });
    });
    describe('When method patchController is called a', () => {
        test.skip('Then an user should be patched', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                tokenPayload: { id: '123456789012345678901234' },
                body: { comic: '123456789012345678901239' },
            };
            User.findById = jest.fn().mockResolvedValue({
                comics: [
                    '123456789012345678901234',
                    '123456789012345678901235',
                ],
                save: jest.fn(),
            });
            await controller.patchController(req, res, next);
            expect(res.send).toBeCalled();
        });
    });
});
