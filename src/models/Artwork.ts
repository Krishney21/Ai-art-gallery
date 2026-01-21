import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArtwork extends Document {
    title: string;
    artist: string;
    description: string;
    imageUrl: string;
    publicId: string;
    tags: string[];
    createdAt: Date;
}

const ArtworkSchema: Schema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

// Prevent overwrite on hot reload
const Artwork: Model<IArtwork> = mongoose.models.Artwork || mongoose.model<IArtwork>('Artwork', ArtworkSchema);

export default Artwork;
