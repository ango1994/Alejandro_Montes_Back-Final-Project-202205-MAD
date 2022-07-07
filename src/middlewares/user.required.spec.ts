import { NextFunction, Response } from 'express';
import { ExtRequest } from '../interfaces/token';
import { User } from '../models/user.model';
import { userRequiredForUser } from './user.required';

describe('Given the function userRequiredForUser', () => {
    let req: Partial<ExtRequest>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    beforeEach(() => {
        req = {
            params: { id: '123456789012345678901234' },
            body: { name: 'pepe' },
            tokenPayload: { id: '123456789012345678901234' },
        };
        next = jest.fn();
    });
    describe('When it is called', () => {
        test('Then next should be called', async () => {
            User.findById = jest
                .fn()
                .mockResolvedValueOnce({ _id: '123456789012345678901234' });
            await userRequiredForUser(
                req as ExtRequest,
                res as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When it is called', () => {
        test('Then next should be called with error', async () => {
            await userRequiredForUser(
                req as ExtRequest,
                res as Response,
                next as NextFunction
            );

            expect(next).toHaveBeenCalled();
        });
    });
});
