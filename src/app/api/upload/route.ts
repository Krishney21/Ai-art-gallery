import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import { UploadApiResponse } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const artist = formData.get('artist') as string;
        const description = formData.get('description') as string;

        if (!file || !title || !artist) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Connect DB
        await dbConnect();

        // Upload to Cloudinary
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'ai-gallery',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!);
                }
            ).end(buffer);
        });

        // Save to MongoDB
        const artwork = await Artwork.create({
            title,
            artist,
            description: description || '',
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            tags: [], // Tags will be generated later or manually added
        });

        return NextResponse.json({ success: true, data: artwork }, { status: 201 });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
