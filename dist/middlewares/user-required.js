import { User } from '../models/user.model.js';
export const userRequiredForTasks = async (req, resp, next) => {
    // el usuario tiene acceso al recurso (e.g. Tarea)
    const userID = req.tokenPayload.id;
    const findTask = await User.findById(req.params.id);
    if (findTask?.id === userID) {
        next();
    }
    else {
        const error = new Error();
        error.name = 'UserAuthorizationError';
        next(error);
    }
};
