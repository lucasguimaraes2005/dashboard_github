"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const { data: repositories, isLoading } = useQuery({
    queryKey: ["repositories"],
    queryFn: async () => {
      const response = await fetch("/api/github/repositories");
      if (!response.ok) throw new Error("Failed to fetch repositories");
      return response.json();
    },
    enabled: !!session,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Your Repositories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories?.map((repo: any) => (
          <Card key={repo.id} className="p-6">
            <h2 className="text-xl font-semibold mb-2">{repo.name}</h2>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {repo.description || "No description available"}
            </p>
            <Button
              onClick={() => router.push(`/dashboard/${repo.full_name}`)}
              className="w-full"
            >
              Analyze with AI
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}