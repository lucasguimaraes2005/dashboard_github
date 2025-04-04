"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Search, Code, GitBranch, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  language?: string;
  stargazers_count: number;
  forks_count: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const { data: repositories, isLoading } = useQuery<Repository[]>({
    queryKey: ["repositories"],
    queryFn: async () => {
      const response = await fetch("/api/github/repositories");
      if (!response.ok) throw new Error("Failed to fetch repositories");
      return response.json();
    },
    enabled: !!session,
  });

  const filteredRepos = repositories?.filter((repo: Repository) => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando seus repositórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Seus repositórios</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar repositórios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredRepos?.length === 0 ? (
        <div className="text-center py-20">
          <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Nenhum repositório encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar sua busca ou crie um novo repositório no GitHub</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos?.map((repo: Repository) => (
            <Card key={repo.id} className="overflow-hidden border hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold truncate">
                    {repo.name}
                  </CardTitle>
                  {repo.private && (
                    <Badge variant="outline" className="ml-2 text-xs">Privado</Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2 h-10">
                  {repo.description || "Sem descrição disponível"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  {repo.language && (
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                      <span>{repo.language}</span>
                    </div>
                  )}
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  )}
                  {repo.forks_count > 0 && (
                    <div className="flex items-center">
                      <GitBranch className="w-3 h-3 mr-1" />
                      <span>{repo.forks_count}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 pb-4">
                <Button
                  onClick={() => router.push(`/dashboard/${repo.full_name}`)}
                  className="w-full"
                >
                  Analisar com IA
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getLanguageColor(language: string): string {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Ruby: "#701516",
    PHP: "#4F5D95",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Rust: "#dea584",
    Dart: "#00B4AB",
  };

  return colors[language as keyof typeof colors] || "#8257e5";
}
