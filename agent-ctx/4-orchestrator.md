# Task 4: Communication Pattern Check — Full Implementation

## Files Modified
1. `src/types/index.ts` — Added 3 new PatternId types: `stonewall-cycle`, `misaligned-expectations`, `communication-withdrawal`
2. `src/data/tool-registry.ts` — Replaced placeholder with full question tree (4 branches × 3 questions + 2 universal + 1 final)
3. `src/data/patterns.ts` — Added 3 new communication-specific pattern rules
4. `src/data/advice.ts` — Added 4 new communication advice snippets (cm-7 through cm-10)
5. `src/components/lovecheck/homepage.tsx` — Activated Communication Pattern Check card, updated pattern examples

## Question Tree Structure
- **Routing question**: "How would you describe the way you and your partner communicate?"
- **4 branches**: direct, avoidant, passive_aggressive, improving
- **3 branch questions** per branch (total 12 branch questions)
- **2 universal questions**: partner understanding needs, communication closeness scale
- **1 optional final open-ended question**
- **Total**: 7 questions per path (1 routing + 3 branch + 2 universal + 1 final)

## Signal Calibration
- Healthy answers: negative or 0 signals
- Mixed answers: 1-2 signal points
- Problematic answers: 2-3 signal points
- All existing signal keys used: clarity_low, consistency_low, effort_imbalance, emotional_availability_low, boundary_friction, follow_through_low, trust_instability, repair_potential_high, mixed_signals_high, future_ambiguity

## New Patterns
1. **Stonewall Cycle** (elevated risk, weight 8) — pursue-withdraw dynamic
2. **Misaligned Expectations** (moderate risk, weight 6) — different assumptions about communication
3. **Communication Withdrawal** (high risk, weight 9) — progressive avoidance of important conversations

## Verification
- ESLint: ✅ Zero errors
- Dev server: ✅ Compiling successfully
