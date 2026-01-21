"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
// import { useForm } from "react-hook-form";
// Actually react-hook-form is standard with shadcn form. I'll stick to controlled inputs to save installing zod/hook-form unless complexity grows.
// Simple controlled inputs for Title, Artist, Description.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        description: "",
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.svg']
        },
        maxFiles: 1,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !formData.title || !formData.artist) {
            toast.error("Please fill in all required fields and upload an image.");
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("title", formData.title);
        data.append("artist", formData.artist);
        data.append("description", formData.description);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Upload failed");

            toast.success("Artwork uploaded successfully!");
            setFile(null);
            setPreview(null);
            setFormData({ title: "", artist: "", description: "" });
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error((error as any).message);
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
    };

    return (
        <Card className="w-full max-w-lg mx-auto border-muted/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Upload Artwork</CardTitle>
                <CardDescription>Share your creation with the gallery.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Celestial Dreams"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="artist">Artist Name</Label>
                        <Input
                            id="artist"
                            placeholder="e.g. Alex Doe"
                            value={formData.artist}
                            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Tell us about the artwork..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                            }`}
                    >
                        <input {...getInputProps()} />
                        {preview ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <UploadCloud size={32} />
                                <p className="text-sm font-medium">
                                    {isDragActive ? "Drop it here!" : "Drag & drop or click to upload"}
                                </p>
                                <p className="text-xs">Supports JPG, PNG, WEBP, SVG</p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={uploading}>
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Submit Artwork"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
