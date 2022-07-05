import { NextFunction, Request, response, Response } from 'express';
import { iTokenPayload } from '../interfaces/token.js';
import { User } from '../models/user.model.js';
import * as aut from '../services/authorization.js';

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

    loginController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const findUser: any = await User.findOne({ name: req.body.name });
        if (
            !findUser ||
            !(await aut.compare(req.body.passwd, findUser.passwd))
        ) {
            const error = new Error('Invalid user or password');
            error.name = 'UserAuthorizationError';
            next(error);
            return;
        }
        const tokenPayLoad: iTokenPayload = {
            id: findUser.id,
            name: findUser.name,
        };

        const token = aut.createToken(tokenPayLoad);
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify({ token, id: findUser.id }));
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

    patchController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const newItem = await User.findByIdAndUpdate(req.params.id, req.body);
        if (!newItem || req.body.email) {
            const error = new Error('Invalid user');
            error.name = 'UserError';
            next(error);
            return;
        }
        resp.setHeader('Content-type', 'application/json');
        resp.send(JSON.stringify(newItem));
    };
}
