import { UploadForm } from "@/components/upload-form";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

export default function UploadPage() {
    return (
        <main className="min-h-screen p-8 bg-background flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Gradients for Premium Feel */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl space-y-8 z-10">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Submit Your Art</h1>
                    <p className="text-muted-foreground text-lg">Join the AI-curated exhibition.</p>
                </div>
                <UploadForm />
                <div className="text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">Back to Gallery</Link>
                </div>
            </div>
            <Toaster />
        </main>
    );
}
