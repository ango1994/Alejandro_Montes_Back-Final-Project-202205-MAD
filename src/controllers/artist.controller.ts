import { Request, Response } from 'express';
import { Artist } from '../models/artist.model.js';

export class ArtistController {
    getAllController = async (req: Request, res: Response) => {
        req;
        res.setHeader('Content-type', 'application/json');
        res.send(await Artist.find());
    };

    getController = async (req: Request, resp: Response) => {
        resp.setHeader('Content-type', 'application/json');
        const artist = await Artist.findById(req.params.id);
        if (artist) {
            resp.send(JSON.stringify(artist));
        } else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
}
