"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <Button
      size="lg"
      onClick={() => signIn("github")}
      className="gap-2"
    >
      <Github className="w-5 h-5" />
      Faça login com GitHub
    </Button>
  );
}