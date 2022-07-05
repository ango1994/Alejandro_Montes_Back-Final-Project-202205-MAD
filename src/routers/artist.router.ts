import { Router } from 'express';
import { ArtistController } from '../controllers/artist.controller.js';

export const artistController = new ArtistController();
export const artistRouter = Router();

artistRouter.get('/', artistController.getAllController);
artistRouter.get('/:id', artistController.getController);
artistRouter.post('/', artistController.postController);
