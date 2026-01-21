"use server";

import dbConnect from "@/lib/mongodb";
import Exhibition, { IExhibition } from "@/models/Exhibition";

export async function getPublishedExhibitions(): Promise<IExhibition[]> {
    try {
        await dbConnect();
        const exhibitions = await Exhibition.find({ status: 'published' })
            .populate('artworkIds')
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();
        return JSON.parse(JSON.stringify(exhibitions));
    } catch (error) {
        console.error("Failed to fetch published exhibitions:", error);
        return [];
    }
}
