"use server";

import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { IArtwork } from "@/models/Artwork";

export async function getArtworks(): Promise<IArtwork[]> {
    try {
        await dbConnect();
        // Use .lean() to get plain objects, convert _id to string if needed for client keys
        const artworks = await Artwork.find({}).sort({ createdAt: -1 }).lean();

        // Parse objects to replace _id with string id if necessary, or pass as is.
        // Mongoose documents are not directly passable to Client Components.
        // Serialization hack:
        return JSON.parse(JSON.stringify(artworks));
    } catch (error) {
        console.error("Failed to fetch artworks:", error);
        return [];
    }
}
