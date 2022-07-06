import { NextFunction, Request, Response } from 'express';
import { ExtRequest } from '../interfaces/token.js';
import { User } from '../models/user.model.js';

export const userRequiredForTasks = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    // el usuario tiene acceso al recurso (e.g. Tarea)

    const userID = (req as unknown as ExtRequest).tokenPayload.id;
    const findTask = await User.findById(req.params.id);
    if (findTask?.id === userID) {
        next();
    } else {
        const error = new Error();
        error.name = 'UserAuthorizationError';
        next(error);
    }
};
