import { JwtPayload } from 'jsonwebtoken';

export interface iTokenPayload extends JwtPayload {
    id: string;
    name: string;
}
