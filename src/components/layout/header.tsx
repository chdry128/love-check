"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, BookOpen, Grid3X3, History, Menu, X, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  className?: string;
  onGoHome?: () => void;
  onOpenJournal?: () => void;
  onOpenHistory?: () => void;
  onOpenPatterns?: () => void;
}

const navLinks = [
  {
    label: "Tools",
    icon: Grid3X3,
    href: "#tools",
    description: "All relationship tools",
  },
  {
    label: "Patterns",
    icon: Layers,
    href: "#patterns",
    description: "Pattern library & glossary",
    action: "patterns" as const,
  },
  {
    label: "Journal",
    icon: BookOpen,
    href: "#journal",
    description: "Articles and insights",
  },
];

export function Header({ className, onGoHome, onOpenJournal, onOpenHistory, onOpenPatterns }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string, action?: string) => {
    setMobileMenuOpen(false);

    if (action === "patterns" && onOpenPatterns) {
      onOpenPatterns();
      return;
    }

    if (href === "#journal" && onOpenJournal) {
      onOpenJournal();
      return;
    }

    // If not on home view, go home first
    if (onGoHome) {
      onGoHome();
    }

    // Then scroll to section after a tick
    setTimeout(() => {
      const sectionId = href.replace("#", "");
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/10">
            <Heart className="h-4 w-4 text-primary fill-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">LoveCheck</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href, link.action)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200"
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </button>
            );
          })}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200"
          >
            <History className="h-3.5 w-3.5" />
            History
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <span className="text-xs text-muted-foreground/70 hidden md:inline-block">
            Relationship Intelligence
          </span>
          <ThemeToggle />
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            aria-label="History"
          >
            <History className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden border-t bg-background"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href, link.action)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-muted-foreground/70">{link.description}</div>
                    </div>
                  </button>
                );
              })}
              <div className="pt-1 mt-1 border-t">
                <span className="text-xs text-muted-foreground/50 px-3">
                  Relationship Intelligence Platform
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
