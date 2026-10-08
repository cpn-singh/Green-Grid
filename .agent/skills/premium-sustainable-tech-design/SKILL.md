---
name: premium-sustainable-tech-design
description: "Guidelines and instructions for building or restyling websites adhering to the SYLVRA premium sustainable tech design system in DESIGN_SYSTEM.md."
---

# Premium Sustainable Tech Design Skill

When building or restyling any website here, follow [DESIGN_SYSTEM.md](file:///c:/Users/admin/Desktop/Green%20Grid/DESIGN_SYSTEM.md) exactly: same tokens, components, spacing, typography and motion, unless I say otherwise.

## Core Directives

1. **Brand Voice & Aesthetic:**
   - Dark, cinematic, mission-critical infrastructure tone.
   - Dual-slash technical titles (e.g., `MODULE // SUBTITLE`).
   - Accentuate titles with mint spans (`#10b981`).

2. **Colors:**
   - Backgrounds: `#000000`, `#020504`, `#040806`, cards `rgba(10, 18, 14, 0.7)`.
   - Mint Accents: `#10b981` (primary), `#34d399` (bright/hover), `#a7f3d0` (light readout).
   - Borders: `rgba(16, 185, 129, 0.15)` default, `rgba(16, 185, 129, 0.35)` hover.
   - Text: `#ffffff` (primary), `#cbd5e1` (secondary), `#94a3b8` (muted), `#64748b` (dim/labels).

3. **Typography:**
   - Headings & Body: `General Sans` (or system fallback sans-serif).
   - Badges, Buttons, Metrics, Form Labels: `JetBrains Mono`.

4. **Component Patterns:**
   - **Tactical Corner Brackets:** Add `.sf-card-corner` (8px x 8px, 2px solid `#10b981`) on all card corners.
   - **Glass Panels:** `backdrop-filter: blur(16px)` on elevated surfaces.
   - **Micro-Badges:** Uppercase monospace with 6px pulsing dot (`#10b981`).
   - **Buttons:** JetBrains Mono uppercase, letter-spacing 2px, glowing shadow on `#10b981`.

5. **Motion:**
   - Micro-interactions: 250ms–300ms ease transitions.
   - Heavy entrances: `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Continuous loops: subtle radar sweep (`6s linear`) and pulsing dots (`2s ease-in-out`).
