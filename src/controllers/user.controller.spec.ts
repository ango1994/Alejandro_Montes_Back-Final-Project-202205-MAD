import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';
import * as aut from '../services/authorization.js';
jest.mock('../services/authorization.js');
import { UserController } from './user.controller';

describe('Given a instantiated controller Usercontroller', () => {
    let controller: UserController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;

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
            await controller.getController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method getController is called with a existing id', () => {
        test('Then res.send should be called', async () => {
            User.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ user: 'test' }),
            });
            await controller.getController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(
                JSON.stringify({ user: 'test' })
            );
        });
    });

    describe('When method getController is called with a non existing id', () => {
        test('Then res.send should be called', async () => {
            User.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });
            await controller.getController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({}));
        });
    });

    describe('When method postController is called and req.body dont satisfy the required params', () => {
        test('Then next should be called', async () => {
            await controller.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method postController is called', () => {
        test('Then res.send should be called', async () => {
            User.create = jest.fn().mockResolvedValue({ test: 'test' });
            await controller.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(
                JSON.stringify({ test: 'test' })
            );
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('When method loginController is called an invalid name or password', () => {
        test('Then res.send should be called', async () => {
            User.findOne = jest.fn().mockResolvedValue(req.body);
            (aut.compare as jest.Mock).mockResolvedValue(false);
            await controller.loginController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method loginController is called', () => {
        test('Then res.send should be called', async () => {
            User.findOne = jest.fn().mockResolvedValue(req.body);
            (aut.compare as jest.Mock).mockResolvedValue(true);
            (aut.createToken as jest.Mock).mockResolvedValue('234234234');
            await controller.loginController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalled();
        });
    });
    describe('When method deleteController is called', () => {
        test('Then an user should be deleted', async () => {
            await controller.deleteController(
                req as Request,
                res as Response,
                next as NextFunction
            );
        });
    });
});
