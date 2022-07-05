import { Comic } from '../models/comic.model';
import { ComicController } from './comic.controller';
describe('Given a instantiated controller ComicController', () => {
    let controller;
    let req;
    let resp;
    beforeEach(() => {
        req = {
            params: { id: '1' },
        };
        resp = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
        controller = new ComicController();
    });
    describe('When method getAllController is called', () => {
        test('Then resp.send should be called', async () => {
            (Comic.find = jest
                .fn()
                .mockReturnValue({
                populate: jest.fn().mockResolvedValue({ comic: 'test' }),
            })),
                await controller.getAllController(req, resp);
            expect(Comic.find).toHaveBeenCalled();
            expect(resp.send).toHaveBeenCalledWith({ comic: 'test' });
        });
    });
});
