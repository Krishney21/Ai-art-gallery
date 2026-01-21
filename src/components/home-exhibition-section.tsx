import { getPublishedExhibitions } from "@/lib/public-exhibitions";
// import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export async function ExhibitionSection() {
    const exhibitions = await getPublishedExhibitions();

    if (exhibitions.length === 0) return null;

    return (
        <section id="exhibitions" className="container py-12 px-4 md:px-8 border-b">
            <div className="flex items-center gap-2 mb-8">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Curated Exhibitions</h2>
            </div>

            <div className="grid gap-8">
                {exhibitions.map((exhibition) => (
                    <div key={exhibition._id as unknown as string} className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{exhibition.title}</h3>
                            <p className="text-muted-foreground">{exhibition.description}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {exhibition.artworkIds.map((art: any) => (
                                <Card key={art._id} className="overflow-hidden border-0 bg-muted/40 group cursor-pointer">
                                    <div className="relative aspect-square">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={art.imageUrl}
                                            alt={art.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <p className="font-medium text-xs truncate">{art.title}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{art.artist}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
