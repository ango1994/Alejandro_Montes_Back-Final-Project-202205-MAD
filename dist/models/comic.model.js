import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose.js';
mongooseConnect();
const comicSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    image: { type: mongoose.SchemaTypes.String, required: true },
    description: { type: mongoose.SchemaTypes.String, required: true },
    publicationDate: { type: mongoose.SchemaTypes.String, required: true },
    category: {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: ['american', 'european', 'manga'],
    },
    artist: [{ type: mongoose.Types.ObjectId, ref: 'Artist' }],
    score: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            score: {
                type: mongoose.SchemaTypes.Number,
                required: true,
                min: 0,
                max: 10,
            },
        },
    ],
});
comicSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const Comic = mongoose.model('Comic', comicSchema);
