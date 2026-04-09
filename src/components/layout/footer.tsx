"use client";

import { cn } from "@/lib/utils";
import { Heart, Shield, BookOpen } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto border-t bg-muted/30",
        className
      )}
    >
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
              </div>
              <span className="font-semibold">LoveCheck</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              See your relationship patterns clearly — without judgment. Built
              with care, backed by research, designed for real people.
            </p>
          </div>

          {/* Trust */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <Shield className="h-3.5 w-3.5" />
              Trust & Privacy
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>Your data stays in your browser</li>
              <li>No accounts or tracking required</li>
              <li>Not clinical advice — just patterns</li>
              <li>Results are never shared</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              Resources
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>Based on attachment theory research</li>
              <li>Informed by couples therapy frameworks</li>
              <li>When in crisis, please seek professional support</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-5">
          <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
            LoveCheck is not a substitute for professional therapy, counseling,
            or medical advice. If you are in an unsafe situation, please reach
            out to a qualified professional or crisis helpline. This tool
            identifies patterns — not diagnoses.
          </p>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} LoveCheck. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
