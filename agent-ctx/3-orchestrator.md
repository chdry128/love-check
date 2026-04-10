---
Task ID: 3
Agent: orchestrator
Task: Create Icebreaker Generator and Heart Confetti features, integrate into homepage and result page

Work Log:
- Created `src/components/lovecheck/icebreaker-generator.tsx` ("use client") with:
  - 24 unique conversation starters across 3 depth levels (Light & Fun, Getting Deeper, Heart-to-Heart)
  - Three tab buttons for depth level selection with color-coded active states
  - "Generate New" button picks random starter from selected depth (avoids repeat)
  - Beautiful card display with depth level badge, quoted starter text, related tool suggestion
  - Related tools: Light & Fun -> texting-energy-match, Getting Deeper -> communication-pattern-check, Heart-to-Heart -> attachment-style-lens
  - AnimatePresence smooth card transition on new generation
  - Session counter showing how many starters explored
  - Romantic warm styling with rounded-xl border, dark mode support
  - No emoji characters; Lucide icons: RefreshCw, MessageSquare, Heart, Sparkles, ArrowRight
  - Reduced motion support via useReducedMotion

- Added `HeartConfetti` component inside `src/components/lovecheck/result-page.tsx`:
  - 20 small heart SVGs burst outward from center on result page load
  - Random colors (rose/pink/coral variants), random direction, random distance, random rotation
  - Animation: scale 0 -> 1 -> float away with gravity (y increases)
  - Framer Motion with staggered initial delays (0.03s apart)
  - Duration ~2 seconds, auto-cleans after 2.5s
  - Positioned absolute, centered, z-20 above content
  - Reduced motion: renders nothing

- Integrated HeartConfetti into ResultPage:
  - Added useState and useEffect imports
  - Added showConfetti state (default true)
  - Added useEffect to set showConfetti false after 3 seconds
  - Renders after LowRiskDecoration and before the Card

- Integrated IcebreakerGenerator into homepage:
  - Added import for IcebreakerGenerator component
  - Added new "Conversation Starters" section before the Testimonials section
  - Wrapped in AnimatedSection for scroll-triggered animation

Files Created:
- `src/components/lovecheck/icebreaker-generator.tsx`

Files Modified:
- `src/components/lovecheck/result-page.tsx` — Added HeartConfetti component + showConfetti state/integration
- `src/components/lovecheck/homepage.tsx` — Added IcebreakerGenerator import + section

Verification:
- ESLint: Zero errors
- Dev server: Compiles successfully with no errors
- No indigo or blue colors used
- No actual emoji characters — all icons are Lucide
- Full dark mode support via Tailwind dark: variants
