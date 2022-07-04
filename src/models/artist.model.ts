import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose';
import { iRelationField } from '../interfaces/relation.field';

(async () => {
    await mongooseConnect();
})();

export interface iArtist {
    id?: string;
    name: string;
    about: string;
    image: string;
    rol: 'writer' | 'cartoonist';
    comics: Array<iRelationField>;
}

const artistSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    about: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    image: { type: mongoose.SchemaTypes.String, required: true },
    rol: {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: ['writer', 'cartoonist'],
    },
    comics: [{ type: mongoose.Types.ObjectId, ref: 'Comic' }],
});

artistSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});

export const Artist = mongoose.model('Artist', artistSchema);
