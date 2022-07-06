import { User } from '../models/user.model';
// import { User } from '../models/user.model';
import { UserController } from './user.controller';
describe('Given a instantiated controller Usercontroller', () => {
    let controller;
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            params: { id: '123456789012345678901234' },
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
});
