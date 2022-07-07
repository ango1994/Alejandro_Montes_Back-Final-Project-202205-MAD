import { NextFunction, Request, Response } from 'express';
import { Artist } from '../models/artist.model';
import { ArtistController } from './artist.controller';

describe('Given a instantiated controller ArtistController', () => {
    let controller: ArtistController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: { name: 'pepe' },
        };
        res = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();

        controller = new ArtistController() as any;
    });
    describe('When method getAllController is called', () => {
        test('Then resp.send should be called', async () => {
            (Artist.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ artist: 'test' }),
            })),
                await controller.getAllController(
                    req as Request,
                    res as Response
                );
            expect(Artist.find).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ artist: 'test' });
        });
    });
    describe('When method getController is called and it returns valid data', () => {
        test('Then resp.send should be called with the data', async () => {
            (Artist.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ artist: 'test' }),
            })),
                await controller.getController(req as Request, res as Response);
            expect(Artist.findById).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(
                JSON.stringify({ artist: 'test' })
            );
        });
    });
    describe('When method getController is called and it does not return data', () => {
        test('Then resp.send should be called whithout the data', async () => {
            const artist = null;
            (Artist.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(artist),
            })),
                await controller.getController(req as Request, res as Response);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({}));
        });
    });

    describe('When method postController is called', () => {
        test('Then resp.send should be called with the data', async () => {
            const artist = { artist: 'test' };
            Artist.create = jest.fn().mockReturnValue(artist);
            await controller.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify(artist));
        });
    });

    describe('When method postController is called', () => {
        test('Then resp.send should be called with the data', async () => {
            Artist.create = jest.fn().mockRejectedValueOnce(null);
            await controller.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
