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
        console.log(req.params.id);
        const result = await Artist.findById(req.params.id);
        if (result) {
            resp.send(JSON.stringify(result));
        } else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
}
