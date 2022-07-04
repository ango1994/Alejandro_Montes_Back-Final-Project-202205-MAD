import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose';
import { isEmail } from '../helpers/is.email';
(async () => {
    await mongooseConnect();
})();
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
export const User = mongoose.model('User', userSchema);
