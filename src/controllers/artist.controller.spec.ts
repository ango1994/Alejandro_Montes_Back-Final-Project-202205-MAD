import { Request, Response } from 'express';
import { Artist } from '../models/artist.model';
import { ArtistController } from './artist.controller';

describe('Given a instantiated controller ArtistController', () => {
    let controller: ArtistController;
    let req: Partial<Request>;
    let resp: Partial<Response>;
    beforeEach(() => {
        req = {
            params: { id: '1' },
        };
        resp = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };

        controller = new ArtistController() as any;
    });
    describe('When method getAllController is called', () => {
        test('Then resp.send should be called', async () => {
            (Artist.find = jest.fn().mockReturnValue({ artist: 'test' })),
                await controller.getAllController(
                    req as Request,
                    resp as Response
                );
            expect(Artist.find).toHaveBeenCalled();
            expect(resp.send).toHaveBeenCalledWith({ artist: 'test' });
        });
    });
    describe('When method getController is called and it returns valid data', () => {
        test('Then resp.send should be called with the data', async () => {
            const artist = { artist: 'test' };
            Artist.findById = jest.fn().mockResolvedValue(artist);
            await controller.getController(req as Request, resp as Response);
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(artist));
        });
    });
    describe('When method getController is called and it does not return data', () => {
        test('Then resp.send should be called whithout the data', async () => {
            const artist = null;
            Artist.findById = jest.fn().mockResolvedValue(artist);
            await controller.getController(req as Request, resp as Response);
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify({}));
        });
    });
});
