"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";

export default function RepositoryAnalysis() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["analysis", params.owner, params.repo],
    queryFn: async () => {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: params.owner,
          repo: params.repo,
        }),
      });
      if (!response.ok) throw new Error("Failed to analyze repository");
      return response.json();
    },
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
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to repositories
      </Button>

      <h1 className="text-4xl font-bold mb-8">
        Analysis: {params.owner}/{params.repo}
      </h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">AI Summary</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {analysis?.summary}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Commits</h2>
          <div className="space-y-4">
            {analysis?.commits?.slice(0, 5).map((commit: any) => (
              <div key={commit.sha} className="border-b pb-4">
                <p className="font-medium">{commit.commit.message}</p>
                <p className="text-sm text-muted-foreground">
                  by {commit.commit.author.name} on{" "}
                  {new Date(commit.commit.author.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">README</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap">{analysis?.readme}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
}