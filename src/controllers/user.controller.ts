import { NextFunction, Request, response, Response } from 'express';
import { User } from '../models/user.model.js';

export class UserController {
    getController = async (req: Request, resp: Response) => {
        resp.setHeader('Content-type', 'application/json');
        const user = await User.findById(req.params.id).populate('comics');
        if (user) {
            resp.send(JSON.stringify(user));
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
            const newItem = await User.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newItem));
        } catch (error) {
            next(error);
        }
    };

    deleteController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const deletedItem = await User.findByIdAndDelete(req.params.id);
            response.status(202);
            res.send(JSON.stringify(deletedItem));
        } catch (error) {
            next(error);
        }
    };

    patchController = async (req: Request, resp: Response) => {
        const newItem = await User.findByIdAndUpdate(req.params.id, req.body);
        resp.setHeader('Content-type', 'application/json');
        resp.send(JSON.stringify(newItem));
    };
}
