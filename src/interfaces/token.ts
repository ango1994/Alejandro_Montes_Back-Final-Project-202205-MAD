import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
export interface iTokenPayload extends JwtPayload {
    id: string;
    name: string;
}

export interface ExtRequest extends Request {
    tokenPayload: JwtPayload; // iTokenPayload;
}
