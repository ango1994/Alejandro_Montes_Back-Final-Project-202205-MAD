import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose.js';
import { isEmail } from '../helpers/is.email.js';
mongooseConnect();
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
