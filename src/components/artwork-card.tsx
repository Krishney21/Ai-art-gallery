"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IArtwork } from "@/models/Artwork";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ArtworkCardProps {
  artwork: IArtwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // 🔐 Normalize data once (prevents ALL runtime crashes)
  const tags = Array.isArray(artwork.tags) ? artwork.tags : [];
  const title = artwork.title || "Untitled";
  const artist = artwork.artist || "Unknown Artist";
  const description = artwork.description || "";
  const imageUrl = artwork.imageUrl || "/placeholder.png";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this artwork?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/artworks/${artwork._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to delete artwork");
      }

      toast.success("Artwork deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete artwork");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Card className="overflow-hidden border-0 bg-card/40 hover:bg-card/60 transition-colors group relative">
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Hover Description */}
                {description && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-medium truncate">
                      {description}
                    </p>
                  </div>
                )}

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 h-8 w-8"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start p-4 gap-1">
              <h3 className="font-semibold text-lg tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">
                by {artist}
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0 bg-transparent shadow-none overflow-hidden sm:rounded-none">
        <div className="relative w-auto h-auto flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-md shadow-2xl"
          />

          {/* Top Left: Title */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white max-w-[300px]">
            <DialogTitle className="text-xl font-bold tracking-tight">
              {title}
            </DialogTitle>
          </div>

          {/* Top Right: Artist */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white">
            <p className="text-sm font-medium text-gray-300 uppercase tracking-wider text-right">
              Artist
            </p>
            <p className="text-lg font-semibold">{artist}</p>
          </div>

          {/* Bottom Left: Description */}
          {description && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white max-w-[400px]">
              <DialogDescription className="text-sm leading-relaxed text-gray-200">
                {description}
              </DialogDescription>
            </div>
          )}

          {/* Bottom Right: Tags */}
          {tags.length > 0 && (
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
              <div className="flex flex-wrap justify-end gap-2 max-w-[300px]">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-white border-white/30 bg-black/40 backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
