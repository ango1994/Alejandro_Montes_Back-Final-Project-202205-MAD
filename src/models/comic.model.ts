/* istanbul ignore file */
import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose.js';
import { iRelationField } from '../interfaces/relation.field.js';
import { iRelationFieldscore } from '../interfaces/relation.field.score.js';

mongooseConnect();

export interface iComic {
    id?: string;
    name: string;
    image: string;
    description: string;
    publicationDate: string;
    category: 'american' | 'european' | 'manga';
    artist: Array<iRelationField>;
    score: Array<{ user: iRelationFieldscore; scored: number }>;
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
            user: { type: mongoose.Types.ObjectId, ref: 'User' },
            scored: {
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
