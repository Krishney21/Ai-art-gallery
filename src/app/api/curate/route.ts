import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import Exhibition from '@/models/Exhibition';
import { model } from '@/lib/gemini';

export async function POST() {
    try {
        await dbConnect();

        // 1. Fetch available artworks
        // Optimization: In a real app, limit this or use vector search. Here we fetch recent 50.
        const artworks = await Artwork.find({}).sort({ createdAt: -1 }).limit(50);

        if (artworks.length < 3) {
            return NextResponse.json({ error: "Not enough artworks to curate (need at least 3)" }, { status: 400 });
        }

        // 2. Prepare prompt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const artworksMetadata = artworks.map((a: any) => ({
            id: a._id.toString(),
            title: a.title,
            artist: a.artist,
            description: a.description,
            tags: a.tags.join(', ')
        }));

        const prompt = `
      You are a world-class art curator. I have a collection of artworks.
      Please analyze their metadata and create a cohesive Exhibition Theme.
      Select 3 to 6 artworks that fit well together under this theme.
      
      Artworks: ${JSON.stringify(artworksMetadata)}

      Return ONLY a JSON object with this structure (no markdown):
      {
        "title": "Exhibition Title",
        "description": "A compelling description of the exhibition theme and why these works were chosen.",
        "selectedArtworkIds": ["id1", "id2", ...],
        "curatorNotes": "Brief internal notes on why this theme is timely or interesting."
      }
    `;

        // 3. Call Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json|```/g, '').trim();
        const curation = JSON.parse(jsonStr);

        // 4. Save Exhibition Draft
        await Exhibition.create({
            title: curation.title,
            description: curation.description,
            artworkIds: curation.selectedArtworkIds,
            status: 'draft',
            curatorNotes: curation.curatorNotes
        });

        return NextResponse.json({ success: true, link: `/curator` });

    } catch (error) {
        console.error("Curation Error:", error);
        return NextResponse.json({ error: "Failed to curate exhibition" }, { status: 500 });
    }
}
