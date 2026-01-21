import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExhibition extends Document {
    title: string;
    description: string;
    artworkIds: mongoose.Types.ObjectId[];
    status: 'draft' | 'published';
    curatorNotes?: string;
    createdAt: Date;
}

const ExhibitionSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    artworkIds: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    curatorNotes: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Exhibition: Model<IExhibition> = mongoose.models.Exhibition || mongoose.model<IExhibition>('Exhibition', ExhibitionSchema);

export default Exhibition;
