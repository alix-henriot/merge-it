"use client"
import { Button } from "@/components/ui/button";
import { useZafClient } from "@/hooks/useZafClient";
import { Merge } from "lucide-react";



export default function SidebarPage() {
    const client = useZafClient();

    return (
        <div className="w-full max-h-72 flex flex-col p-3 space-y-2 bg-background">
            <div className="flex text-base px-3 py-2 rounded-lg border border-ring text-foreground shadow-lg shadow-foreground/5">Ticket 17490
                <Button variant="outline" size="icon" aria-label="Merge">
                    <Merge/>
                </Button>
            </div>
        </div>
    )
}