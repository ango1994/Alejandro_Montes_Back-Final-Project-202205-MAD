import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose';
import { iRelationField } from '../interfaces/relation.field';
import { iRelationFieldscore } from '../interfaces/relation.field.score';

(async () => {
    await mongooseConnect();
})();

export interface iComic {
    id?: string;
    name: string;
    image: string;
    description: string;
    publicationDate: string;
    category: 'american' | 'european' | 'manga';
    artist: Array<iRelationField>;
    score: Array<{ user: iRelationFieldscore; score: number }>;
}

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
