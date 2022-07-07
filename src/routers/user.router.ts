import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { loginRequired } from '../middlewares/login.required.js';
import { userRequiredForUser } from '../middlewares/user.required.js';

export const userController = new UserController();
export const userRouter = Router();

userRouter.get('/:id', userController.getController);
userRouter.post('/', userController.postController);
userRouter.post('/login', userController.loginController);
userRouter.delete(
    '/delete/:id',
    loginRequired,
    userRequiredForUser,
    userController.deleteController
);
userRouter.patch(
    '/:id',
    loginRequired,
    userRequiredForUser,
    userController.patchController
);
