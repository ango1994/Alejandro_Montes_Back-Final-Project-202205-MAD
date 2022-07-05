import { response } from 'express';
import { User } from '../models/user.model.js';
import * as aut from '../services/authorization.js';
export class UserController {
    getController = async (req, resp, next) => {
        resp.setHeader('Content-type', 'application/json');
        let user;
        try {
            user = await User.findById(req.params.id).populate('comics');
        }
        catch (error) {
            next(error);
            return;
        }
        if (user) {
            resp.send(JSON.stringify(user));
        }
        else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
    postController = async (req, resp, next) => {
        let newUser;
        try {
            req.body.password = await aut.encrypt(req.body.password);
            newUser = await User.create(req.body);
        }
        catch (error) {
            next(error);
            return;
        }
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(newUser));
    };
    loginController = async (req, resp, next) => {
        const findUser = await User.findOne({ name: req.body.name });
        console.log(findUser);
        if (!findUser ||
            !(await aut.compare(req.body.password, findUser.password))) {
            const error = new Error('Invalid user or password');
            error.name = 'UserAuthorizationError';
            next(error);
            console.log('erooooor');
            return;
        }
        const tokenPayLoad = {
            id: findUser.id,
            name: findUser.name,
        };
        console.log('pasa');
        const token = aut.createToken(tokenPayLoad);
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify({ token, id: findUser.id }));
    };
    deleteController = async (req, res, next) => {
        try {
            const deletedItem = await User.findByIdAndDelete(req.params.id);
            response.status(202);
            res.send(JSON.stringify(deletedItem));
        }
        catch (error) {
            next(error);
        }
    };
    patchController = async (req, resp, next) => {
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
