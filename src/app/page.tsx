import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getArtworks } from "@/lib/actions";
import { ArtworkCard } from "@/components/artwork-card";
import { ExhibitionSection } from "@/components/home-exhibition-section";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const artworks = await getArtworks();

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            </div>
            <span className="font-bold text-lg tracking-tight">AI Curator</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/curator">
              <Button variant="ghost" size="sm">Curator Dashboard</Button>
            </Link>
            <Link href="/upload">
              <Button size="sm">Submit Art</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-6 md:px-10 overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Where AI Meets Human Creativity
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore exhibitions curated by our advanced AI, analyzing themes, colors, and emotions across hundreds of community submissions.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="#exhibitions">
              <Button size="lg" className="rounded-full px-8">Latest Exhibition</Button>
            </Link>
            <Link href="#gallery">
              <Button size="lg" variant="outline" className="rounded-full px-8">Browse Collection</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Published Exhibitions */}
      <ExhibitionSection />

      {/* Gallery */}
      <section id="gallery" className="container py-12 px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Recent Uploads</h2>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">No artworks found. Be the first to submit!</p>
            <Link href="/upload">
              <Button>Submit Artwork</Button>
            </Link>
            {/* Dev Helper */}
            <div className="mt-8">
              <p className="text-xs text-muted-foreground">Dev: <a href="/api/seed" target="_blank" className="underline">Seed Data</a></p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((art) => (
              <ArtworkCard key={art._id as unknown as string} artwork={art} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
