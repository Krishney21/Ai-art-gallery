import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

export async function GET() {
    await dbConnect();

    const count = await Artwork.countDocuments();
    if (count > 0) {
        return NextResponse.json({ message: 'Database already populated' });
    }

    const mockArtworks = [
        {
            title: "Neon City",
            artist: "CyberPunk_AI",
            description: "A futuristic cityscape bathed in neon lights.",
            imageUrl: "https://images.unsplash.com/photo-1545153206-5b4e72350c23?q=80&w=1000&auto=format&fit=crop",
            publicId: "mock_1",
            tags: ["cyberpunk", "city", "neon"],
        },
        {
            title: "Abstract Waves",
            artist: "FlowMaster",
            description: "Fluid dynamics simulated in a digital canvas.",
            imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
            publicId: "mock_2",
            tags: ["abstract", "blue", "fluid"],
        },
        {
            title: "Digital Renaissance",
            artist: "DaVinci_Bot",
            description: "Classical style reimagined with digital glitches.",
            imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop",
            publicId: "mock_3",
            tags: ["classic", "glitch", "portrait"],
        },
    ];

    await Artwork.insertMany(mockArtworks);

    return NextResponse.json({ success: true, count: mockArtworks.length });
}
