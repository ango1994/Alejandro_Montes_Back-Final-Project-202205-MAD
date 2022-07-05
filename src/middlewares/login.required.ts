import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtRequest, iTokenPayload } from '../interfaces/token';
import { verifyToken } from '../services/authorization';

export const loginRequired = (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const authorization = req.get('authorization');
    let token;
    const tokenError = new Error('Token missing or invalid');
    tokenError.name = 'TokenError';
    let decodedToken: string | JwtPayload;
    if (
        authorization &&
        authorization.toLocaleLowerCase().startsWith('bearer')
    ) {
        token = authorization.substring(7);
        decodedToken = verifyToken(token);
        if (typeof decodedToken === 'string') {
            next(tokenError);
        } else {
            (req as ExtRequest).tokenPayload = decodedToken as iTokenPayload;
            next();
        }
    } else {
        next(tokenError);
    }
};
