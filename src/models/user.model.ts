import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose';
import { iRelationField } from '../interfaces/relation.field';
import { isEmail } from '../helpers/is.email';

(async () => {
    await mongooseConnect();
})();

export interface iUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    comics: Array<iRelationField>;
}

const userSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        validate: [isEmail, 'Provided email is not valid.'],
    },
    password: { type: mongoose.SchemaTypes.String, required: true },
    comics: [{ type: mongoose.Types.ObjectId, ref: 'Comic' }],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.passwd;
    },
});

export const User = mongoose.model('User', userSchema);
