"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function DashboardHeader() {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo/Title - left aligned */}
        <h2 className="text-lg font-semibold tracking-tight">
          GitHub AI Dashboard
        </h2>

        {/* Right side content with proper spacing */}
        <div className="flex items-center">
          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {session?.user && (
            <>
              {/* User info */}
              <div className="flex items-center mx-4">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover h-8 w-8"
                  />
                )}
                <span className="hidden sm:inline-block font-medium text-sm ml-3">
                  {session.user.name}
                </span>
              </div>
              
              {/* Logout button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="Logout"
                className="ml-2"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}