import { Router } from 'express';
import { ComicController } from '../controllers/comic.controller.js';
export const comicController = new ComicController();
export const comicRouter = Router();
comicRouter.get('/', comicController.getAllController);
comicRouter.get('/:id', comicController.getController);
comicRouter.post('/', comicController.postController);
comicRouter.patch('/:id', comicController.patchController);
