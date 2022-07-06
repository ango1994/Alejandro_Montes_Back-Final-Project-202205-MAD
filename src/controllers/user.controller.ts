import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { iTokenPayload } from '../interfaces/token.js';
import { User } from '../models/user.model.js';
import * as aut from '../services/authorization.js';

export class UserController {
    getController = async (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Content-type', 'application/json');
        let user;
        try {
            user = await User.findById(req.params.id).populate('comics');
        } catch (error) {
            next(error);
            return;
        }
        if (user) {
            res.send(JSON.stringify(user));
        } else {
            res.status(404);
            res.send(JSON.stringify({}));
        }
    };

    postController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        let newUser: HydratedDocument<any>;
        try {
            req.body.password = await aut.encrypt(req.body.password);
            newUser = await User.create(req.body);
        } catch (error) {
            next(error);
            return;
        }
        res.setHeader('Content-type', 'application/json');
        res.status(201);
        res.send(JSON.stringify(newUser));
    };

    loginController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const findUser: any = await User.findOne({ name: req.body.name });
        console.log(findUser);
        if (
            !findUser ||
            !(await aut.compare(req.body.password, findUser.password))
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
        res.setHeader('Content-type', 'application/json');
        res.status(201);
        res.send(JSON.stringify({ token, id: findUser.id }));
    };

    deleteController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const deletedItem = await User.findByIdAndDelete(req.params.id);
            res.status(202);
            res.send(JSON.stringify(deletedItem));
        } catch (error) {
            next(error);
        }
    };

    patchController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const newItem = await User.findByIdAndUpdate(req.params.id, req.body);
        if (!newItem || req.body.email) {
            const error = new Error('Invalid user');
            error.name = 'UserError';
            next(error);
            return;
        }
        res.setHeader('Content-type', 'application/json');
        res.send(JSON.stringify(newItem));
    };
}
