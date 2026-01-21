"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CurationTrigger() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCurate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/curate", { method: "POST" });
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Curation failed");

            toast.success("New exhibition drafted!");
            router.refresh();
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error((error as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleCurate} disabled={loading} className="gap-2">
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="h-4 w-4" />
            )}
            Generate Exhibition
        </Button>
    );
}
