import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getExhibitions, publishExhibition, deleteExhibition } from "@/lib/exhibition-actions";
import { CurationTrigger } from "@/components/curation-trigger";
import Link from "next/link";
import { IExhibition } from "@/models/Exhibition";

export const dynamic = 'force-dynamic';

export default async function CuratorDashboard() {
    const exhibitions = await getExhibitions();

    return (
        <main className="min-h-screen p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Curator Dashboard</h1>
                        <p className="text-muted-foreground">Manage AI-generated exhibitions.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/">
                            <Button variant="outline">Back to Gallery</Button>
                        </Link>
                        <CurationTrigger />
                    </div>
                </div>

                <div className="grid gap-6">
                    {exhibitions.length === 0 ? (
                        <div className="text-center py-20 border border-dashed rounded-lg">
                            <p className="text-muted-foreground">No exhibitions found. Trigger the AI Curator to start.</p>
                        </div>
                    ) : (
                        exhibitions.map((exhibition: IExhibition) => (
                            <ExhibitionCard key={exhibition._id as unknown as string} exhibition={exhibition} />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

function ExhibitionCard({ exhibition }: { exhibition: IExhibition }) {
    async function onPublish() {
        "use server";
        await publishExhibition(exhibition._id as unknown as string);
    }

    async function onDelete() {
        "use server";
        await deleteExhibition(exhibition._id as unknown as string);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle>{exhibition.title}</CardTitle>
                        <CardDescription>{exhibition.description}</CardDescription>
                    </div>
                    <Badge variant={exhibition.status === 'published' ? 'default' : 'secondary'}>
                        {exhibition.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {exhibition.artworkIds.map((art: any) => (
                        <div key={art._id} className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={art.imageUrl} alt={art.title} className="object-cover w-full h-full" />
                        </div>
                    ))}
                </div>
                {exhibition.curatorNotes && (
                    <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground mt-2">
                        <strong>AI Notes:</strong> {exhibition.curatorNotes}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <form action={onDelete}>
                    <Button variant="destructive" size="sm">Delete</Button>
                </form>
                {exhibition.status === 'draft' && (
                    <form action={onPublish}>
                        <Button size="sm">Publish to Gallery</Button>
                    </form>
                )}
            </CardFooter>
        </Card>
    );
}
