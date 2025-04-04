"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";

export default function RepositoryAnalysis() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const queryClient = useQueryClient();

  interface Commit {
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        date: string;
      };
    };
  }
  

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

  const handleReanalyze = () => {
    queryClient.invalidateQueries({
      queryKey: ["analysis", params.owner, params.repo],
    });
      };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para os repositórios
        </Button>
        
        <Button 
          onClick={handleReanalyze}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refazer análise
        </Button>
      </div>

      <h1 className="text-4xl font-bold mb-8">
        Análise: {params.owner}/{params.repo}
      </h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Sumário da IA</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {analysis?.summary}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Commits recentes</h2>
          <div className="space-y-4">
            {analysis?.commits?.slice(0, 5).map((commit: Commit) => (
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