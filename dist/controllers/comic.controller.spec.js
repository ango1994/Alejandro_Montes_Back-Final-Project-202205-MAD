import { Comic } from '../models/comic.model';
import { ComicController } from './comic.controller';
describe('Given a instantiated controller ComicController', () => {
    let controller;
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: { name: 'test', rol: 'test', score: 7 },
        };
        res = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
        controller = new ComicController();
    });
    describe('When method getAllController is called', () => {
        test('Then resp.send should be called', async () => {
            (Comic.find = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce({ comic: 'test' }),
            })),
                await controller.getAllController(req, res);
            expect(Comic.find).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ comic: 'test' });
        });
    });
    describe('When method getController is called and a comic is found', () => {
        test('Then resp.send should be called', async () => {
            (Comic.findById = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce({ comic: 'test' }),
            })),
                await controller.getController(req, res);
            expect(Comic.find).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({ comic: 'test' }));
        });
    });
    describe('When method getController is called and it doesnt find a comic', () => {
        test('Then res.status should be called with 404', async () => {
            (Comic.findById = jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce(null),
            })),
                await controller.getController(req, res);
            expect(Comic.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({}));
        });
    });
    describe('When method postController is called ', () => {
        test('Then res.status should be called with 404', async () => {
            (Comic.create = jest.fn().mockReturnValueOnce({ test: 'test' })),
                await controller.postController(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({ test: 'test' }));
        });
    });
    describe('When method postController is called ', () => {
        test('Then next should be called', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                body: { name: 'test' },
            };
            Comic.create = jest.fn().mockRejectedValueOnce(null);
            await controller.postController(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method searchController is called with a query with 3 or more characters', () => {
        test('Then res.send should be called', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                query: { q: 'test' },
            };
            Comic.find = jest.fn().mockResolvedValueOnce(req.query);
            await controller.searchController(req, res);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify(req.query));
        });
    });
    describe('When method patchController is called with a valid id and a valid score', () => {
        test('Then res.send should be called', async () => {
            req = {
                params: { id: '62c834dae9fb7865c9e48044' },
                body: { score: 7 },
                tokenPayload: { id: '123456789012345678901234' },
            };
            Comic.findById = jest.fn().mockResolvedValueOnce({
                score: [{ user: '123456789012345678901234' }],
                save: jest.fn(),
            });
            await controller.patchScoreController(req, res, next);
            expect(res.send).toHaveBeenCalled();
        });
    });
    describe('When method patchController is called with a valid id and a invalid score', () => {
        test('Then res.send should be called', async () => {
            req = {
                params: { id: '62c834dae9fb7865c9e48044' },
                body: { score: 'test' },
                tokenPayload: { id: '123456789012345678901234' },
            };
            Comic.findById = jest.fn().mockResolvedValueOnce({
                score: [
                    { user: '123456789012345678901234', score: 3 },
                    { user: '123456789012345678901235', score: 3 },
                ],
                save: jest.fn(),
            });
            await controller.patchScoreController(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method patchController is called with valid id and valid score and there is no previous score', () => {
        test('Then res.send should be called', async () => {
            req = {
                params: { id: '123456789012345678901234' },
                body: { score: 7 },
                tokenPayload: { id: '123456789012345678901234' },
            };
            Comic.findById = jest.fn().mockResolvedValueOnce({
                score: [],
                save: jest.fn(),
            });
            await controller.patchScoreController(req, res, next);
            expect(res.send).toHaveBeenCalled();
        });
    });
    describe('When method patchController is called with an invalid id and valid score and there is no previous score', () => {
        test('Then next should be called', async () => {
            req = {
                params: { id: '12345678901234' },
                body: { score: 9 },
                tokenPayload: { id: '123456' },
            };
            Comic.findById = jest.fn().mockResolvedValueOnce({});
            await controller.patchScoreController(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
