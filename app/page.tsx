import { LoginButton } from "@/components/login-button";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center space-y-6">
        <Github className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter">
          GitHub AI Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-[600px]">
          Connect your GitHub account to analyze your repositories with AI and get
          intelligent insights about your projects.
        </p>
        <LoginButton />
      </div>
    </div>
  );
}