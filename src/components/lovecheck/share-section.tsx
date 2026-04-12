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
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FinalResult, ConfidenceLevel, RiskLevel } from "@/types";

interface ShareSectionProps {
  text: string;
  className?: string;
  selectedTheme?: "rose-night" | "neon-pulse" | "sunset-heat";
  result?: FinalResult;
}

type ExportMode = "standard" | "portrait";

const THEME_EXPORT_BG: Record<
  NonNullable<ShareSectionProps["selectedTheme"]>,
  [string, string, string]
> = {
  "rose-night": ["#0f172a", "#4c0519", "#881337"],
  "neon-pulse": ["#020617", "#083344", "#0e7490"],
  "sunset-heat": ["#111827", "#7c2d12", "#9d174d"],
};

function clampScore(value: number): number {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function buildRiskScore(riskLevel: RiskLevel, confidence: ConfidenceLevel): number {
  const baseByRisk: Record<RiskLevel, number> = {
    low: 22,
    moderate: 48,
    elevated: 73,
    high: 91,
  };

  const confidenceAdjust: Record<ConfidenceLevel, number> = {
    low: -4,
    moderate: 0,
    "fairly-high": 4,
    high: 7,
  };

  return clampScore(baseByRisk[riskLevel] + confidenceAdjust[confidence]);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length >= maxLines - 1) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines;
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

async function buildGeneratedCardJpeg(
  result: FinalResult,
  mode: ExportMode,
  selectedTheme: NonNullable<ShareSectionProps["selectedTheme"]>
): Promise<Blob | null> {
  const width = mode === "portrait" ? 1080 : 1200;
  const height = mode === "portrait" ? 1350 : 900;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const [start, mid, end] = THEME_EXPORT_BG[selectedTheme];
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, start);
  gradient.addColorStop(0.55, mid);
  gradient.addColorStop(1, end);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(width * 0.18, height * 0.1, width * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.88, height * 0.9, width * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const cardX = width * 0.08;
  const cardY = mode === "portrait" ? 170 : 130;
  const cardW = width * 0.84;
  const cardH = mode === "portrait" ? 900 : 620;

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(cardX + 12, cardY + 14, cardW, cardH);
  ctx.fillStyle = "rgba(10,14,28,0.92)";
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  const dominant = result.dominantPattern;
  const riskLevel = dominant?.riskLevel ?? "moderate";
  const confidence = dominant?.confidence ?? "moderate";
  const score = buildRiskScore(riskLevel, confidence);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "700 58px Segoe UI, Arial, sans-serif";
  ctx.fillText("LoveCheck", cardX + 44, cardY + 78);
  ctx.font = "500 32px Segoe UI, Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.fillText("Relationship Snapshot", cardX + 44, cardY + 122);

  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = "700 170px Segoe UI, Arial, sans-serif";
  ctx.fillText(String(score), cardX + 46, cardY + 330);
  ctx.font = "600 36px Segoe UI, Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText("/ 100", cardX + 258, cardY + 328);

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "600 30px Segoe UI, Arial, sans-serif";
  ctx.fillText(`Pattern: ${dominant?.name ?? "Mixed"}`, cardX + 46, cardY + 386);
  ctx.fillText(`Confidence: ${confidence}`, cardX + 46, cardY + 428);

  const meterX = cardX + 46;
  const meterY = cardY + 480;
  const meterW = cardW - 92;
  const meterH = 24;
  const meterGrad = ctx.createLinearGradient(meterX, meterY, meterX + meterW, meterY);
  meterGrad.addColorStop(0, "#10b981");
  meterGrad.addColorStop(0.5, "#f59e0b");
  meterGrad.addColorStop(1, "#f43f5e");
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(meterX, meterY, meterW, meterH);
  ctx.fillStyle = meterGrad;
  ctx.fillRect(meterX, meterY, (meterW * score) / 100, meterH);

  const needleX = meterX + (meterW * score) / 100;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(needleX, meterY - 14);
  ctx.lineTo(needleX - 9, meterY - 1);
  ctx.lineTo(needleX + 9, meterY - 1);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "500 24px Segoe UI, Arial, sans-serif";
  ctx.fillText("Low", meterX, meterY + 56);
  ctx.fillText("Medium", meterX + meterW / 2 - 40, meterY + 56);
  ctx.fillText("High", meterX + meterW - 52, meterY + 56);

  ctx.fillStyle = "rgba(255,255,255,0.93)";
  ctx.font = "600 30px Segoe UI, Arial, sans-serif";
  const hook = score >= 70
    ? "Can your relationship pass this red flag check?"
    : "Can your connection pass this relationship check?";
  ctx.fillText(hook, cardX + 46, cardY + cardH - 110);

  ctx.font = "500 22px Segoe UI, Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  const wrapped = wrapText(ctx, result.summary, cardW - 92, 2);
  wrapped.forEach((line, i) => {
    ctx.fillText(line, cardX + 46, cardY + cardH - 72 + i * 30);
  });

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "700 28px Segoe UI, Arial, sans-serif";
  ctx.fillText("lovecheck.app", 68, height - 56);

  return canvasToJpegBlob(canvas, 0.93);
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

function canShareFiles(): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) {
    return false;
  }

  try {
    const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function buildPortraitCanvas(
  sourceCanvas: HTMLCanvasElement,
  theme: NonNullable<ShareSectionProps["selectedTheme"]>
): HTMLCanvasElement {
  const output = document.createElement("canvas");
  output.width = 1080;
  output.height = 1350;

  const ctx = output.getContext("2d");
  if (!ctx) return output;

  const [start, mid, end] = THEME_EXPORT_BG[theme];
  const gradient = ctx.createLinearGradient(0, 0, output.width, output.height);
  gradient.addColorStop(0, start);
  gradient.addColorStop(0.55, mid);
  gradient.addColorStop(1, end);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, output.width, output.height);

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(180, 140, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(940, 1220, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const maxWidth = 900;
  const maxHeight = 980;
  const scale = Math.min(maxWidth / sourceCanvas.width, maxHeight / sourceCanvas.height);
  const drawWidth = sourceCanvas.width * scale;
  const drawHeight = sourceCanvas.height * scale;
  const drawX = (output.width - drawWidth) / 2;
  const drawY = 170;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  drawRoundedRectPath(ctx, drawX, drawY, drawWidth, drawHeight, 28);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, drawX, drawY, drawWidth, drawHeight, 28);
  ctx.clip();
  ctx.drawImage(sourceCanvas, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 38px ui-sans-serif, system-ui, -apple-system, Segoe UI";
  ctx.fillText("LoveCheck Challenge", 86, 86);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "500 25px ui-sans-serif, system-ui, -apple-system, Segoe UI";
  ctx.fillText("Can your friends beat this score?", 86, 124);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "600 23px ui-sans-serif, system-ui, -apple-system, Segoe UI";
  ctx.fillText("Take your check at love-check.app", 86, 1265);

  return output;
}

async function captureResultCardJpeg(
  mode: ExportMode,
  selectedTheme: NonNullable<ShareSectionProps["selectedTheme"]>,
  result?: FinalResult
): Promise<Blob | null> {
  if (result) {
    const generated = await buildGeneratedCardJpeg(result, mode, selectedTheme);
    if (generated) return generated;
  }

  const target = document.querySelector("[data-result-card]") as HTMLElement | null;
  if (!target) return null;

  const html2canvas = (await import("html2canvas")).default;
  const sourceCanvas = await html2canvas(target, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
  });

  if (mode === "standard") {
    return canvasToJpegBlob(sourceCanvas, 0.92);
  }

  const portraitCanvas = buildPortraitCanvas(sourceCanvas, selectedTheme);
  return canvasToJpegBlob(portraitCanvas, 0.93);
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

export function ShareSection({ text, className, selectedTheme = "rose-night", result }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharingCard, setSharingCard] = useState(false);
  const [exportMode, setExportMode] = useState<ExportMode>("standard");

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
    setSharingCard(true);
    try {
      const cardBlob = await captureResultCardJpeg(exportMode, selectedTheme, result);
      const filename = `lovecheck-result-${Date.now()}.jpg`;

      if (cardBlob && canShareFiles()) {
        const file = new File([cardBlob], filename, { type: "image/jpeg" });
        await navigator.share({
          title: "My LoveCheck Result",
          text: "My LoveCheck result card",
          files: [file],
        });
        return;
      }

      if (cardBlob) {
        const url = URL.createObjectURL(cardBlob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }

      await nativeShare(text);
    } catch {
      // User cancelled or image sharing is unavailable
    } finally {
      setTimeout(() => setSharingCard(false), 800);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const cardBlob = await captureResultCardJpeg(exportMode, selectedTheme, result);
      if (!cardBlob) return;

      const link = document.createElement("a");
      const url = URL.createObjectURL(cardBlob);
      link.download = `lovecheck-result-${Date.now()}.jpg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
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

      <div className="rounded-xl border bg-background/60 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Export style</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setExportMode("standard")}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              exportMode === "standard"
                ? "border-primary/60 bg-primary/10 text-foreground"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            )}
          >
            Standard Card
          </button>
          <button
            type="button"
            onClick={() => setExportMode("portrait")}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              exportMode === "portrait"
                ? "border-primary/60 bg-primary/10 text-foreground"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            )}
          >
            Instagram 1080x1350
          </button>
        </div>
      </div>

      {/* Social share grid */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleNativeShare}
          disabled={sharingCard}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "text-fuchsia-700 dark:text-fuchsia-300",
            "hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30",
            "hover:border-fuchsia-200 dark:hover:border-fuchsia-800",
            "hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0",
            sharingCard && "opacity-60 pointer-events-none"
          )}
          aria-label="Share card image"
        >
          {sharingCard ? (
            <>
              <Check className="h-4 w-4 shrink-0" />
              <span className="truncate">Shared</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 shrink-0" />
              <span className="truncate">Share Card Image</span>
            </>
          )}
        </button>

        {socialButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <a
              key={btn.label}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
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
            </a>
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
            "hover:border-rose-200 dark:hover:border-rose-800",
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
              <span className="truncate">Download JPG</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
