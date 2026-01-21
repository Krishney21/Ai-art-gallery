"use server";

import dbConnect from "@/lib/mongodb";
import Exhibition, { IExhibition } from "@/models/Exhibition";
import { revalidatePath } from "next/cache";

export async function getExhibitions(): Promise<IExhibition[]> {
    try {
        await dbConnect();
        const exhibitions = await Exhibition.find({})
            .populate('artworkIds')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(exhibitions));
    } catch (error) {
        console.error("Failed to fetch exhibitions:", error);
        return [];
    }
}

export async function publishExhibition(id: string) {
    try {
        await dbConnect();
        await Exhibition.findByIdAndUpdate(id, { status: 'published' });
        revalidatePath('/curator');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to publish exhibition:", error);
        return { success: false, error: 'Failed to publish' };
    }
}

export async function deleteExhibition(id: string) {
    try {
        await dbConnect();
        await Exhibition.findByIdAndDelete(id);
        revalidatePath('/curator');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete exhibition:", error);
        return { success: false, error: 'Failed to delete' };
    }
}
