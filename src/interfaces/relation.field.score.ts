import mongoose from 'mongoose';

export interface iRelationFieldscore {
    type: mongoose.Types.ObjectId;
    ref: string;
    score: number;
}
