# GreenGrid — Creative Brief & Design Notes

> **Studio Collective:** Senior In-House Design & Engineering Group  
> **Date:** October 2026  
> **Subject:** Complete Handcrafted Overhaul of GreenGrid  

---

## 1. Creative Brief

### The Audience
Chief Infrastructure Officers (CIOs), hyperscale data center facility developers, and institutional power traders building 20 MW to 200 MW compute campuses in India (Yotta, Sify, Nxtra, AWS, Microsoft, AdaniConneX).
They are electrical engineers, energy economists, and land acquisition directors. They despise SaaS buzzwords, floating gradient cards, and artificial marketing fluff. They make decisions based on 400kV substation headroom, ISTS waiver deadlines, wheeling charges, and round-the-clock (RTC) hourly dispatch firmness.

### What the Brand Believes
- Compute cannot outrun electrical engineering. AI scale in India is not constrained by GPUs; it is bottlenecked by high-voltage grid substations and round-the-clock clean megawatts.
- We do not sell "seamless cloud synergies". We originate, structure, and wheel physical power across high-voltage national corridors.
- True infrastructure design is quiet, authoritative, and structurally honest.

### Three Personality Adjectives
1. **Tectonic** — Heavy, grounded, physically anchored in substations, transmission towers, and gigawatt capacities.
2. **Rigorous** — Precise, engineering-grade, metric-honest. Zero decorative filler.
3. **Austere** — Stripped of modern SaaS gimmicks (no purple blobs, no glowing orbs, no pill badges on every headline). High typographic tension like an architectural monograph or industrial SCADA manual.

### The One Core Visual Idea: The High-Voltage Single-Line Diagram (SLD) & Power Ledger
In electrical engineering, complex transmission networks are rendered through **Single-Line Diagrams (SLDs)**: continuous hairline conductors, busbars, transformer step-downs, circuit breaker nodes, and tabular power schedules.
The entire site is built around this metaphor:
- An asymmetrical, hairline-connected grid layout where sections feel like an unfolding industrial dispatch manual.
- Technical registration ticks (`+`), hairline busbars (`border-[#19241d]`), and monospace telemetry schedules.
- Background: A living, ambient physical high-voltage grid environment with real substation footage and an interactive 3D transmission corridor model that responds to scroll.
- Content structured into distinct, purposeful shapes: an engineering power ledger, a dynamic dispatch matrix, an interactive substation radar, and an institutional offtake desk.

---

## 2. Real-World References (Non-SaaS)
1. **Swiss Industrial & Technical Manuals (Karl Gerstner & Otl Aicher):** Strict asymmetry, monumental type contrasted with micro-labels, disciplined typographic hierarchies.
2. **National Grid UK & CEA India SCADA Control Rooms:** High-contrast tactical single-line telemetry, busbar status indicators, unambiguous data presentation.
3. **Architectural Monographs (*El Croquis*, Tadao Ando):** Monolithic spatial pacing, deep carbon tones, wide asymmetrical margins, deliberate negative space.
4. **S&P Global Platts & CERC Regulatory Ledgers:** Dense, factual tariff schedules where typography carries information, not decoration.

---

## 3. Design Tokens

### The 5-Color Limited Palette
| Token | Hex | Role | Usage Rule |
| :--- | :--- | :--- | :--- |
| **Obsidian Slate** | `#080b09` | Canvas background | 85% of total screen area |
| **Bone Paper** | `#f0f4f1` | Primary text & titles | High legibility, crisp contrast |
| **Graphite Oxide** | `#6b7c72` | Secondary labels & subtext | Muted technical metadata |
| **Busbar Hairline** | `#19241d` | Grid borders & structural rules | Ultra-subtle, tactile division |
| **Energized Signal Green** | `#22c55e` | Active conductors & confirmed metrics | **Used with extreme restraint** (accents, active relays, live data points only) |

### Typography Pairing
- **Display Headlines:** `Space Grotesk` (weights 500, 700) — Bold, geometric, industrial character with authentic quirks.
- **Data & Monospace:** `JetBrains Mono` (weights 400, 500, 600) — Engineering telemetry, tariffs, capacities, coordinate pairs.
- **Text Body:** `General Sans` (weights 400, 500) — Highly legible neutral grotesk.

---

## 4. The 5 Decisions That Give This Site Its Character

1. **Rejection of the "Card Grid" Paradigm:** Rather than uniform rows of 3 identical rounded cards with icons, sections use asymmetrical split ledgers, full-width dispatch tables, single-line telemetry diagrams, and architectural typography.
2. **The 7-Second Video Revelation & Ambient Substation Backdrop:** The background is not a decorative purple gradient; it is genuine high-voltage infrastructure footage paired with a real-time 3D Three.js transmission corridor grid that rotates with scroll physics.
3. **Engineering-Grade Vocabulary:** No "seamless", "cutting-edge", or "unlocking potential". Instead: "400kV Substation Headroom", "CERC Open Access Regulations", "ISTS Transmission Waiver", "8,760h Baseload Dispatch".
4. **Hairline Busbar Grid & Registration Marks:** Structural lines with subtle `+` corner crosshairs evoke technical blueprints and electrical control panels.
5. **Interactive 3D Single-Line Corridor on Scroll:** A custom 3D WebGL Three.js model of India's transmission grid where power pulses physically travel from generation hubs (Khavda, Bhadla) into data center clusters (Mumbai, Chennai, Noida) as the user scrolls.

---

## 5. Harsh Art Director Critique Pass (Pre-Build Targets)

| Criterion | Target Score (1-5) | Specific Fix |
| :--- | :---: | :--- |
| **Could this layout be swapped with another company by changing the logo?** | **5/5** | No. The substation schedules, single-line diagrams, and CERC regulatory models are uniquely built for high-voltage energy procurement. |
| **Does every section have a different job and a different shape?** | **5/5** | Section 1: Hero with 3D medallion. Section 2: Dense horizontal telemetry ticker. Section 3: Asymmetric interactive dispatch calculator. Section 4: Full-width GIS radar preview. Section 5: Tabular power schedule. Section 6: Institutional offtake intake. |
| **Is there one clear focal point per screen?** | **5/5** | High typographic contrast ensures immediate visual hierarchy. |
| **Does the copy sound like a person with taste and opinions?** | **5/5** | Replaced all buzzword filler with direct, factual engineering statements. |
| **Is there at least one detail a visitor would screenshot?** | **5/5** | The interactive 3D WebGL transmission corridor and the live hourly dispatch matrix. |
| **Mobile Responsiveness:** | **5/5** | Fluid responsive collapse with intentional touch targets and clean vertical scanning. |
| **Accessibility:** | **5/5** | WCAG AAA contrast (`18:1`), semantic HTML5, zero layout shifts, `prefers-reduced-motion` compliance. |
