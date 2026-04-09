"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Download,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareSectionProps {
  text: string;
  className?: string;
}

// ── Share helper functions ───────────────────────────────────

function encodeShareText(text: string): string {
  return encodeURIComponent(text);
}

function getShareUrl(): string {
  if (typeof window === "undefined") return "";
  return encodeURIComponent(window.location.href);
}

async function nativeShare(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;

  try {
    await navigator.share({
      title: "LoveCheck Results",
      text,
    });
    return true;
  } catch {
    // User cancelled or share failed — fall through to URL-based sharing
    return false;
  }
}

// ── Social share URL builders ────────────────────────────────

function twitterShareUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeShareText(text)}&url=${getShareUrl()}`;
}

function facebookShareUrl(): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${getShareUrl()}&quote=${encodeShareText("My LoveCheck results")}`;
}

function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeShareText(text + " " + decodeURIComponent(getShareUrl()))}`;
}

function linkedinShareUrl(): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${getShareUrl()}`;
}

// ── Social button config ─────────────────────────────────────

interface SocialButton {
  label: string;
  icon: React.ElementType;
  color: string;
  hoverBg: string;
  hoverBorder: string;
  url: string;
}

function buildSocialButtons(text: string): SocialButton[] {
  return [
    {
      label: "X / Twitter",
      icon: Twitter,
      color: "text-slate-700 dark:text-slate-300",
      hoverBg: "hover:bg-slate-100 dark:hover:bg-slate-800",
      hoverBorder: "hover:border-slate-300 dark:hover:border-slate-600",
      url: twitterShareUrl(text),
    },
    {
      label: "Facebook",
      icon: Facebook,
      color: "text-blue-600 dark:text-blue-400",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
      hoverBorder: "hover:border-blue-200 dark:hover:border-blue-800",
      url: facebookShareUrl(),
    },
    {
      label: "WhatsApp",
      icon: Link2,
      color: "text-emerald-600 dark:text-emerald-400",
      hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
      hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-800",
      url: whatsappShareUrl(text),
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      color: "text-sky-700 dark:text-sky-400",
      hoverBg: "hover:bg-sky-50 dark:hover:bg-sky-950/30",
      hoverBorder: "hover:border-sky-200 dark:hover:border-sky-800",
      url: linkedinShareUrl(),
    },
  ];
}

// ── Component ────────────────────────────────────────────────

export function ShareSection({ text, className }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const socialButtons = buildSocialButtons(text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: textarea-based copy
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    await nativeShare(text);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Dynamic import to keep html2canvas out of the critical bundle
      const html2canvas = (await import("html2canvas")).default;

      // Find the closest result-card ancestor (or fallback to the whole page)
      const target = document.querySelector("[data-result-card]") as HTMLElement;
      if (!target) {
        // If no result card found, show a toast-like feedback
        setTimeout(() => setDownloading(false), 1500);
        return;
      }

      const canvas = await html2canvas(target, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `lovecheck-result-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // html2canvas failed — fail silently
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Share Your Results
      </h3>

      {/* Share text preview */}
      <div className="rounded-xl border bg-muted/30 p-4">
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
          {text}
        </p>

        {/* Copy button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy to clipboard
            </>
          )}
        </Button>
      </div>

      {/* Social share grid */}
      <div className="grid grid-cols-2 gap-2">
        {socialButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              type="button"
              onClick={handleNativeShare}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                btn.color,
                btn.hoverBg,
                btn.hoverBorder,
                "hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0"
              )}
              aria-label={`Share on ${btn.label}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{btn.label}</span>
            </button>
          );
        })}

        {/* Download as Image */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "text-rose-600 dark:text-rose-400",
            "hover:bg-rose-50 dark:hover:bg-rose-950/30",
            "hover:border-rose-200 dark:hover:hover:border-rose-800",
            "hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0",
            downloading && "opacity-60 pointer-events-none"
          )}
          aria-label="Download result as image"
        >
          {downloading ? (
            <>
              <Check className="h-4 w-4 shrink-0" />
              <span className="truncate">Saved</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 shrink-0" />
              <span className="truncate">Save as Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
