import { NextFunction, Request, Response } from 'express';
import { Comic } from '../models/comic.model.js';

export class ComicController {
    getAllController = async (req: Request, res: Response) => {
        req;
        res.setHeader('Content-type', 'application/json');
        res.send(await Comic.find().populate('artist'));
    };

    getController = async (req: Request, resp: Response) => {
        resp.setHeader('Content-type', 'application/json');
        const comic = await Comic.findById(req.params.id).populate('artist');
        if (comic) {
            resp.send(JSON.stringify(comic));
        } else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };

    postController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            const newItem = await Comic.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newItem));
        } catch (error) {
            next(error);
        }
    };
    patchController = async (req: Request, resp: Response) => {
        const newItem = await Comic.findByIdAndUpdate(req.params.id, req.body);
        resp.setHeader('Content-type', 'application/json');
        resp.send(JSON.stringify(newItem));
    };
}
