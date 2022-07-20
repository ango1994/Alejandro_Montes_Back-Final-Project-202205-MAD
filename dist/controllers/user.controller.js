import { User } from '../models/user.model.js';
import * as aut from '../services/authorization.js';
export class UserController {
    getController = async (req, res, next) => {
        res.setHeader('Content-type', 'application/json');
        let user;
        try {
            user = await User.findById(req.params.id).populate('comics');
        }
        catch (error) {
            next(error);
            return;
        }
        if (user) {
            res.send(JSON.stringify(user));
        }
        else {
            res.status(404);
            res.send(JSON.stringify({}));
        }
    };
    postController = async (req, res, next) => {
        let newUser;
        try {
            req.body.password = await aut.encrypt(req.body.password);
            newUser = await User.create(req.body);
        }
        catch (error) {
            next(error);
            return;
        }
        res.setHeader('Content-type', 'application/json');
        res.status(201);
        res.send(JSON.stringify(newUser));
    };
    loginController = async (req, res, next) => {
        const findUser = await User.findOne({
            name: req.body.name,
        }).populate('comics');
        if (!findUser ||
            !(await aut.compare(req.body.password, findUser.password))) {
            const error = new Error('Invalid user or password');
            error.name = 'UserAuthorizationError';
            next(error);
            return;
        }
        const tokenPayLoad = {
            id: findUser.id,
            name: findUser.name,
        };
        const token = aut.createToken(tokenPayLoad);
        res.setHeader('Content-type', 'application/json');
        res.status(201);
        res.send(JSON.stringify({ token, user: findUser }));
    };
    deleteController = async (req, res) => {
        const deletedItem = await User.findByIdAndDelete(req.tokenPayload.id);
        res.status(202);
        res.send(JSON.stringify(deletedItem));
    };
    patchController = async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user || req.body.email || req.body.name) {
                const error = new Error('Invalid user');
                error.name = 'UserError';
                throw error;
            }
            else {
                let alreadyFavComic;
                if (req.body.comic) {
                    const comic = req.body.comic;
                    alreadyFavComic = user.comics.find((item) => {
                        return JSON.stringify(item) === JSON.stringify(comic);
                    });
                    if (alreadyFavComic) {
                        user.comics = user.comics.filter((item) => String(item) !== String(comic));
                    }
                    else {
                        user.comics.push(comic);
                    }
                }
            }
            const updatedUser = await (await user.save()).populate('comics');
            res.setHeader('Content-type', 'application/json');
            res.send(JSON.stringify(updatedUser));
        }
        catch (error) {
            next(error);
        }
    };
}
