"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Hammer, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ComingSoonTool {
  slug: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

interface ComingSoonModalProps {
  tool: ComingSoonTool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComingSoonModal({
  tool,
  open,
  onOpenChange,
}: ComingSoonModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Save to localStorage
    try {
      const existing = JSON.parse(
        localStorage.getItem("lovecheck-notifications") || "[]"
      );
      existing.push({
        toolSlug: tool?.slug,
        toolName: tool?.name,
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
      });
      localStorage.setItem("lovecheck-notifications", JSON.stringify(existing));
    } catch {
      // silently fail
    }

    setSubmitted(true);
    setEmail("");
    toast.success("You're on the list!", {
      description: `We'll let you know when ${tool?.name} launches.`,
    });
  }

  // Reset state when modal closes or tool changes
  function handleClose(open: boolean) {
    if (!open) {
      setSubmitted(false);
      setEmail("");
    }
    onOpenChange(open);
  }

  if (!tool) return null;

  const Icon = tool.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-left">
          {/* Tool icon and badge */}
          <div className="mx-auto sm:mx-0 mb-3 flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tool.bgColor}`}
            >
              <Icon className={`h-5 w-5 ${tool.color}`} />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              <Hammer className="h-3 w-3" />
              In Development
            </span>
          </div>

          <DialogTitle className="text-xl">{tool.name}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            We&apos;re building this tool right now with care and research. It
            will help you{" "}
            <span className="text-foreground font-medium">
              {tool.description}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Notify Me section */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">
              {submitted ? "You're subscribed!" : "Be the first to know"}
            </span>
          </div>

          {submitted ? (
            <p className="text-xs text-muted-foreground">
              We&apos;ll send a quick note to your inbox when{" "}
              <span className="text-foreground font-medium">{tool.name}</span>{" "}
              is ready. No spam, ever.
            </p>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-9 text-sm"
                aria-label="Email address for notification"
              />
              <Button type="submit" size="sm" className="gap-1.5 h-9">
                <Mail className="h-3.5 w-3.5" />
                Notify Me
              </Button>
            </form>
          )}

          <p className="text-[10px] text-muted-foreground/60">
            Your email stays in your browser. We don&apos;t send it to any
            server.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
