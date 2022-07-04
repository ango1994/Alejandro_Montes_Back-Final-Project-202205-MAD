import mongoose from 'mongoose';

export interface iRelationField {
    type: mongoose.Types.ObjectId;
    ref: string;
}
