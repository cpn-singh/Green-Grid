---
description: "Enforces adherence to the SYLVRA premium sustainable tech design system for all UI and frontend work"
globs: ["**/*.jsx", "**/*.tsx", "**/*.html", "**/*.css", "**/*.js", "**/*.ts"]
---

# Premium Sustainable Tech Design Rule

When building or restyling any website or component in this workspace, follow [DESIGN_SYSTEM.md](file:///c:/Users/admin/Desktop/Green%20Grid/DESIGN_SYSTEM.md) exactly:
- **Tokens:** Use the exact same color palette (`#020504` deep pitch black, `#0a120e` glass surface, `#10b981` mint primary, `#34d399` bright emerald, `#94a3b8` muted slate, `#ffffff` primary white).
- **Typography:** Follow the dual-font system (`General Sans` for clean titles, headings and UI copy; `JetBrains Mono` for badges, buttons, numbers, code, and technical labels).
- **Components & Framing:** Use the tactical HUD corner tick frame pattern (`.sf-card-corner`), micro-badges with pulsing glow dots (`.sf-badge-pulse`), glass panels with `backdrop-filter: blur(16px)`, and neon glow button states.
- **Spacing & Layout:** Respect the `1320px` maximum container width, strict grid systems (2, 3, 4, and 5 columns), and clean mobile single-column collapses at `<= 1024px`.
- **Motion:** Apply consistent easing curves (`cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.65, 0, 0.35, 1)`), subtle tactical button hovers (`translateY(-1px)`), and gentle radar or pulsing loops.

Do not guess or deviate from these tokens, components, spacing, typography, and motion rules unless the user explicitly requests otherwise.
