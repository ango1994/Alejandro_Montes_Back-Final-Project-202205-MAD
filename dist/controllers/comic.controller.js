import { Comic } from '../models/comic.model.js';
export class ComicController {
    getAllController = async (req, res) => {
        req;
        res.setHeader('Content-type', 'application/json');
        res.send(await Comic.find().populate('artist'));
    };
    getController = async (req, resp) => {
        resp.setHeader('Content-type', 'application/json');
        const comic = await Comic.findById(req.params.id).populate('artist');
        if (comic) {
            resp.send(JSON.stringify(comic));
        } else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
    postController = async (req, resp, next) => {
        try {
            const newItem = await Comic.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newItem));
        } catch (error) {
            next(error);
        }
    };
    searchController = async (req, resp, next) => {
        if (req.query.q.length < 3) {
            next();
        } else {
            const comics = await Comic.find({
                name: { $regex: req.query.q, $options: 'i' },
            });
            resp.setHeader('Content-type', 'application/json');
            resp.send(JSON.stringify(comics));
        }
    };
    patchScoreController = async (req, resp) => {
        const userID = req.tokenPayload.id;
        const findComic = await Comic.findById(req.params.id);
        const alreadyScored = findComic?.score.find(
            (userScore) => String(userScore.user) === String(userID)
        );
        if (alreadyScored) {
            alreadyScored.score = req.body.score;
        } else {
            findComic?.score.push({ user: userID, score: req.body.score });
        }
        const newComic = findComic?.save();
        resp.setHeader('Content-type', 'application/json');
        resp.send(JSON.stringify(newComic));
    };
}
