import { response } from 'express';
import { User } from '../models/user.model.js';
export class UserController {
    getController = async (req, resp) => {
        resp.setHeader('Content-type', 'application/json');
        const user = await User.findById(req.params.id).populate('comics');
        if (user) {
            resp.send(JSON.stringify(user));
        }
        else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
    postController = async (req, resp, next) => {
        try {
            const newItem = await User.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newItem));
        }
        catch (error) {
            next(error);
        }
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
    patchController = async (req, resp) => {
        const newItem = await User.findByIdAndUpdate(req.params.id, req.body);
        resp.setHeader('Content-type', 'application/json');
        resp.send(JSON.stringify(newItem));
    };
}
