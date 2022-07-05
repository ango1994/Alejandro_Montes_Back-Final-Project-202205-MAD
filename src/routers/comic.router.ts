import { Router } from 'express';
import { ComicController } from '../controllers/comic.controller.js';
import { loginRequired } from '../middlewares/login.required.js';

export const comicController = new ComicController();
export const comicRouter = Router();

comicRouter.get('/', comicController.getAllController);
comicRouter.get('/:id', comicController.getController);
comicRouter.post('/', comicController.postController);
comicRouter.patch('/:id', comicController.patchController);
comicRouter.patch(
    '/score/:id',
    loginRequired,
    comicController.patchScoreController
);
