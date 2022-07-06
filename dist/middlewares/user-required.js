import { User } from '../models/user.model.js';
export const userRequiredForUser = async (req, resp, next) => {
    const userID = req.tokenPayload.id;
    const findUser = await User.findById(req.params.id);
    if (String(findUser?._id) === String(userID)) {
        next();
    }
    else {
        const error = new Error();
        error.name = 'UserAuthorizationError';
        next(error);
    }
};
