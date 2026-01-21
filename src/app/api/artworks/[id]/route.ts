import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Artwork ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const artwork = await Artwork.findById(id);

        if (!artwork) {
            return NextResponse.json(
                { error: 'Artwork not found' },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        if (artwork.publicId) {
            await cloudinary.uploader.destroy(artwork.publicId);
        }

        // Delete from MongoDB
        await Artwork.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
