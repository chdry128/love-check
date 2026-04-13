"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Shield,
  BookOpen,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Bell,
  ChevronDown,
  ChevronUp,
  Mail,
  Check,
  Phone,
  Globe,
  Users,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FooterProps {
  className?: string;
  onOpenJournal?: () => void;
}

export function Footer({ className, onOpenJournal }: FooterProps) {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    // Save to localStorage — no real backend
    const stored = JSON.parse(localStorage.getItem("lovecheck-newsletter") || "[]");
    stored.push({ email, timestamp: new Date().toISOString() });
    localStorage.setItem("lovecheck-newsletter", JSON.stringify(stored));
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubscribe();
  };

  return (
    <footer
      className={cn(
        "mt-auto border-t bg-muted/30",
        className
      )}
    >
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ── Stats Banner ──────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { value: "9", label: "Active Tools", icon: Sparkles },
            { value: "37+", label: "Pattern Rules", icon: Globe },
            { value: "100%", label: "Private by Design", icon: Shield },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xl sm:text-2xl font-bold">{stat.value}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Newsletter CTA Banner ─────────────────────────── */}
        <div className="mb-8">
          <button
            onClick={() => setNewsletterOpen(!newsletterOpen)}
            className="w-full group rounded-xl border border-dashed border-muted-foreground/25 hover:border-primary/40 bg-muted/20 hover:bg-muted/40 transition-all duration-200 p-4 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Get notified when new tools launch
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Be the first to try new relationship insights
                  </p>
                </div>
              </div>
              {newsletterOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {newsletterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-2 flex flex-col sm:flex-row gap-2 p-4 rounded-xl border bg-background">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-9"
                      disabled={subscribed}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSubscribe}
                    disabled={subscribed || !email.trim()}
                    className="gap-1.5 rounded-lg shrink-0"
                  >
                    {subscribed ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Subscribed!
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ad-banner">
          <a
            href="https://www.profitablecpmratenetwork.com/u1giby0jw?key=470e1e7d6942888dff155b3a7b564cc7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/path-to-ad-image.jpg"
              alt="Advertisement"
            />
          </a>
        </div>

        {/* ── Main 4-Column Grid ───────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <a href="#tools" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                  All Tools
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="/tools" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                  SEO Tools Hub
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <button onClick={onOpenJournal} className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                  Blog Home
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <a href="/blog" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                  Relationship Advice Blog
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#patterns" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                  Pattern Library
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                  FAQ
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
              <Shield className="h-3.5 w-3.5" />
              Trust & Privacy
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                Your data stays in your browser
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                No accounts or tracking required
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                Not clinical advice — just patterns
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                Results are never shared
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              </li>
              <li>
                <a href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</a>
              </li>
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
              <li>Pattern detection with confidence scoring</li>
            </ul>
          </div>
        </div>

        {/* ── Crisis Resources ─────────────────────────────── */}
        <div className="mt-6 rounded-xl border border-red-200/50 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="flex items-start gap-2.5">
            <Phone className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                Need immediate support?
              </p>
              <p className="text-[11px] text-red-600/80 dark:text-red-400/70 mt-0.5 leading-relaxed">
                If you&apos;re in an unsafe situation, please reach out to a qualified professional or crisis helpline. 
                LoveCheck is not a substitute for professional help.
              </p>
            </div>
          </div>
        </div>

        {/* ── Social Links Row ─────────────────────────────── */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {[
            { icon: Twitter, label: "Twitter" },
            { icon: Instagram, label: "Instagram" },
            { icon: Linkedin, label: "LinkedIn" },
            { icon: Github, label: "GitHub" },
          ].map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 hover:shadow-sm"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* ── Bottom Copyright ─────────────────────────────── */}
        <div className="mt-6 border-t pt-5">
          <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
            LoveCheck identifies patterns — not diagnoses. It&apos;s not a
            substitute for professional therapy, counseling, or medical advice.
            This tool is designed for self-reflection and educational purposes only.
          </p>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} LoveCheck. Built with{" "}
            <motion.span
              className="inline-block text-red-500"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            >
              ❤️
            </motion.span>{" "}
            and care.
          </p>
        </div>
      </div>
    </footer>
  );
}
