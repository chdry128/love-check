"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  className?: string;
  onGoHome?: () => void;
}

export function Header({ className, onGoHome }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Heart className="h-4 w-4 text-primary fill-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">LoveCheck</span>
        </button>
        <nav className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs text-muted-foreground">
            Relationship Intelligence
          </span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
