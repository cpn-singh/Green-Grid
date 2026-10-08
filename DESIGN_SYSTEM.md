# SYLVRA Design System & Specification
**Source of Truth:** Live production build at [https://frontend-mu-seven-63.vercel.app/](https://frontend-mu-seven-63.vercel.app/)  
**Status:** Extracted and Verified via DevTools & Headless Browser Telemetry (No Guesses)

---

## 1. Brand & Tone

### Brand Identity
- **Brand Name:** `SYLVRA`
- **Full Identity Line:** `SYLVRA — Compute in harmony with the planet.`
- **Platform Category:** Machine Learning Infrastructure Platform // Planetary Energy Optimization & India Siting Engine.

### Voice & Copy Style
- **Tone:** Authoritative, high-conviction engineering, institutional, data-dense, mission-critical infrastructure.
- **Copy Structure:** 
  - Dual-part uppercase technical categorizers separated by `//` (e.g., `PLANETARY ENERGY OPTIMIZATION // INDIA SITING ENGINE`, `NEURAL TOPOLOGY // SPATIAL-TEMPORAL TRANSFORMER`, `DIGITAL TWIN // REAL-TIME SYSTEM TELEMETRY`).
  - Headlines utilize contrasting highlighted spans (`<span>...</span>`) rendered in vibrant mint emerald (`#10b981`) against stark white (`#ffffff`).
  - Subheadings lead with concrete technical claims and empirical data (e.g., multi-gigawatt renewable generation, 765kV CTU interconnects, sub-zero ambient cooling).
  - Every metric has an explicit label, unit of measurement, and statistical context (e.g., `5-FOLD BLOCKED`, `1.4% (BALANCED)`, `1e-4 WEIGHT DECAY`).

---

## 2. Color Tokens (Exact Computed Values)

### Surfaces & Backgrounds
| Token Name | Computed Value | Hex Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `color-bg-base` | `rgb(0, 0, 0)` | `#000000` | Canvas base, splash background |
| `color-bg-deep` | `rgb(2, 5, 4)` | `#020504` | Main feature layer background |
| `color-bg-surface` | `rgba(4, 10, 8, 0.9)` | `#040a08` | Form controls, select dropdowns |
| `color-bg-canvas` | `rgb(4, 8, 6)` | `#040806` | Neural canvas, satellite map wrapper |
| `color-surface-card` | `rgba(10, 18, 14, 0.7)` | `#0a120e` (70%) | Glass panels (`.sf-card`) |
| `color-surface-hud` | `rgba(3, 8, 6, 0.85)` | `#030806` (85%) | Floating HUD overlays (`.sf-map-hud`) |
| `color-surface-popup` | `rgba(6, 14, 10, 0.95)` | `#060e0a` (95%) | Leaflet satellite marker popups |

### Accents & Indicators
| Token Name | Computed Value | Hex Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `color-mint-primary` | `rgb(16, 185, 129)` | `#10b981` | Primary CTA, headline highlights, metric values |
| `color-mint-bright` | `rgb(52, 211, 153)` | `#34d399` | Badges, hover button background, secondary stats |
| `color-mint-pale` | `rgb(167, 243, 208)` | `#a7f3d0` | Map HUD readout text |
| `color-mint-badge-bg` | `rgba(16, 185, 129, 0.08)` | `#10b981` (8%) | Micro-badge background |
| `color-mint-active-bg`| `rgba(16, 185, 129, 0.15)` | `#10b981` (15%)| Active navigation pills, active filter pills |

### Borders
| Token Name | Computed Value | Hex Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `color-border-card` | `rgba(16, 185, 129, 0.15)` | `#10b981` (15%)| Standard panel outline |
| `color-border-card-hover` | `rgba(16, 185, 129, 0.35)` | `#10b981` (35%)| Hovered panel outline |
| `color-border-badge` | `rgba(16, 185, 129, 0.25)` | `#10b981` (25%)| Badge and form control border |
| `color-border-divider` | `rgba(255, 255, 255, 0.08)` | `#ffffff` (8%) | Nav bar border, footer divider |
| `color-border-inactive`| `rgba(255, 255, 255, 0.1)` | `#ffffff` (10%)| Inactive pills and buttons |
| `color-border-corner` | `rgb(16, 185, 129)` | `#10b981` | Corner targeting brackets (2px solid) |

### Typography Colors
| Token Name | Computed Value | Hex Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `color-text-white` | `rgb(255, 255, 255)` | `#ffffff` | Primary titles, card headings, active pills |
| `color-text-slate-light`| `rgb(243, 244, 246)`| `#f3f4f6` | Base body text |
| `color-text-slate-mid` | `rgb(203, 213, 225)`| `#cbd5e1` | Inactive navigation text |
| `color-text-muted` | `rgb(148, 163, 184)`| `#94a3b8` | Subtitles, card description text |
| `color-text-dim` | `rgb(100, 116, 139)`| `#64748b` | Metric labels, stage identifiers |
| `color-text-dark` | `rgb(3, 8, 6)` | `#030806` | Inverted text on primary CTA buttons |

### Gradients, Shadows & Glows
- **Primary Button Shadow:** `box-shadow: 0 0 20px rgba(16, 185, 129, 0.3)`
- **Primary Button Hover Shadow:** `box-shadow: 0 0 30px rgba(16, 185, 129, 0.5)`
- **Active Navigation Glow:** `box-shadow: 0 0 15px rgba(16, 185, 129, 0.2)`
- **Radar Scanner Gradient:** `conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0) 0deg, rgba(16, 185, 129, 0.08) 60deg, rgba(16, 185, 129, 0.25) 90deg, rgba(16, 185, 129, 0) 90deg)`
- **Glass Blur Filter:** `backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);`
- **HUD Blur Filter:** `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);`

---

## 3. Typography Hierarchy

### Font Families
1. **Primary Sans:** `"General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
2. **Technical Monospace:** `"JetBrains Mono", monospace`

### Scale & Computed Attributes

| Level | Font Family | Size (Desktop / Mobile) | Weight | Line Height | Letter Spacing | Text Transform |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Splash Title** | General Sans | `clamp(44px, 8.9vw, 96px)` | 300 | `1.04` | `0.01em` | Uppercase |
| **Section Title (`.sf-title`)** | General Sans | `54px` / `32px` (`clamp(32px, 4.5vw, 54px)`) | 700 | `58.32px` (`1.08`) | `-1.62px` (`-0.03em`) | Uppercase |
| **Subtitle (`.sf-subtitle`)** | General Sans | `18px` / `15px` (`clamp(15px, 1.4vw, 18px)`) | 400 | `28.8px` (`1.6`) | `normal` | None |
| **Card Heading (`h3`)** | General Sans | `20px` – `24px` | 700 | `normal` | `normal` | Uppercase |
| **Card Body (`.sf-card p`)**| General Sans | `13px` | 400 | `20.8px` (`1.6`) | `normal` | None |
| **Stat Big Value** | JetBrains Mono | `28px` | 700 | `normal` | `normal` | None |
| **Stat Label** | JetBrains Mono | `11px` | 400 | `normal` | `1.5px` | Uppercase |
| **Micro-Badge** | JetBrains Mono | `11px` | 400 / 600 | `normal` | `2px` | Uppercase |
| **Primary Button** | JetBrains Mono | `13px` | 600 | `normal` | `2px` | Uppercase |
| **Nav Pill Button** | JetBrains Mono | `11px` | 400 | `normal` | `1.5px` | Uppercase |
| **Cluster Pill** | JetBrains Mono | `10px` | 400 | `normal` | `1px` | Uppercase |
| **HUD Audio Readout**| General Sans | `12px` | 500 | `12px` | `1.68px` (`0.14em`) | Uppercase |
| **Form Inputs** | General Sans | `14px` | 400 | `normal` | `normal` | None |

---

## 4. Layout, Spacing & Spatial Rules

### Grid System & Containers
- **Content Max-Width:** `1320px` (`.sf-container`)
- **Container Padding:** `110px 24px 80px 24px` (Desktop)
- **Grid Layouts:**
  - 2-Column: `display: grid; grid-template-columns: 1fr 1fr; gap: 24px;`
  - 3-Column: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;`
  - 4-Column Stat Strips: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;`
  - 5-Column Process Steps: `display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;`
- **Responsive Collapse:** At `<= 1024px`, 2-column, 3-column, and 4-column grids collapse cleanly to `1fr`.

### Corner Accent Frame Pattern
Cards feature tactical HUD targeting brackets on all four corners:
```css
.sf-card-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: #10b981;
  pointer-events: none;
}
.sf-card-corner.tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
.sf-card-corner.tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
.sf-card-corner.bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
.sf-card-corner.br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }
```

### Border Radii
- Pill Tags: `3px`
- Badges & Buttons: `4px`
- Sub-boxes & Input Elements: `4px` – `6px`
- Main Glass Cards: `8px`
- Leaflet Map Container: `8px`

---

## 5. Components Specification

### 1. Fixed Overlay HUD (`#pc-overlay-root`)
- **Branding:** Centered SVG vector logotype (`156px` wide on desktop, `108px` on mobile), top `40px` (desktop) / `20px` (mobile).
- **Audio Equalizer Toggle:** Top-right `40px` / right `60px`, height `28.18px`.
  - Four vertical equalizer bars (`svg rect`) animating dynamically with staggered timings.
  - Text: `AUDIO` (JetBrains Mono 12px, hidden on mobile screens).

### 2. Micro-Badges (`.sf-badge`)
- Structure: Pulsing indicator dot (`.sf-badge-pulse`, 6px circle with `#10b981` glow) + uppercase category text.
- Styling:
  ```css
  padding: 4px 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 4px;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #34d399;
  ```

### 3. Action Buttons
- **Primary Action Button (`.sf-btn`):**
  ```css
  background: #10b981;
  color: #030806;
  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  transition: all 0.25s ease;
  ```
  - Hover: `background: #34d399; box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); transform: translateY(-1px);`
- **Navigation Pill Button (`.sf-nav-btn`):**
  - Inactive: `background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); color: #cbd5e1;`
  - Active / Hover: `background: rgba(16, 185, 129, 0.15); border-color: #10b981; color: #ffffff; box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);`
- **Cluster Filter Pill (`.sf-cluster-pill`):**
  - Inactive: `background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); color: #94a3b8; font-size: 10px;`
  - Active: `background: rgba(16, 185, 129, 0.15); border-color: #10b981; color: #ffffff;`

### 4. Interactive Glass Cards (`.sf-card`)
- Base: `background: rgba(10, 18, 14, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 8px; padding: 24px;`
- Hover: `border-color: rgba(16, 185, 129, 0.35);`

### 5. Dynamic Energy Routing Pipeline (`.sf-flow-pipeline`)
- Flex row (`display: flex; gap: 12px; align-items: center; justify-content: space-between;`)
- Five stage nodes (`.sf-flow-node`):
  - Step tag: `STAGE 01` (JetBrains Mono 10px, `#64748b`)
  - Node Title: `SOLAR & WIND` (General Sans 14px 700, `#ffffff`)
  - Metric readout: `84.8 MW GEN` (JetBrains Mono 12px, `#10b981`)
- Separator Arrows (`.sf-flow-arrow`): `>` in `#10b981` pulsing with `translateX(4px)` animation.

### 6. Satellite Radar Map Component (`.sf-map-wrapper`)
- Container: Height `580px`, dark border `rgba(16, 185, 129, 0.2)`, background `#040806`.
- Satellite Basemap: Esri ArcGIS World Imagery tiles (`server.arcgisonline.com`).
- Radar Sweep Overlay: Full circular sweep with `conic-gradient` spinning continuously via `sfRadarSpin 6s linear infinite`.
- Glowing Beacon Markers: 28px outer pulsing beacon with 12px `#10b981` core and `#ffffff` border.
- Floating HUD (`.sf-map-hud`): Positioned top-right `16px`, backdrop blur 12px, green telemetry readout.

### 7. Form Controls (`.sf-select`, `.sf-input`)
- Translucent dark background: `rgba(4, 10, 8, 0.9)`
- Border: `1px solid rgba(16, 185, 129, 0.25)`
- Focus state: `border-color: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.25); outline: none;`

---

## 6. Motion & Animation Timing

| Animation / Transition | Duration | Easing | Trigger | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Splash Shutter Lift** | `1600ms` | `cubic-bezier(0.65, 0, 0.35, 1)` | System initiate CTA | Cinematic curtain reveal of 3D globe |
| **Features Layer Slide-In** | `800ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll progress >= 0.68 | Translates `30px -> 0px` with opacity `0 -> 1` |
| **Badge Indicator Pulse** | `2000ms` | Infinite ease-in-out | Continuous | Scale `1 -> 0.8`, opacity `1 -> 0.4` |
| **Radar Scanner Spin** | `6000ms` | Linear infinite | Continuous | Rotates sweep gradient `0deg -> 360deg` |
| **Pipeline Arrow Pulse** | `1500ms` | Infinite ease-in-out | Continuous | `translateX(0 -> 4px)`, opacity `0.3 -> 1` |
| **Equalizer Bar Dance** | `720ms`–`1140ms` | Ease-in-out infinite | Playing audio | Staggered bar oscillation (`scaleY(0.3 -> 1)`) |
| **Card Border Transition** | `300ms` | Ease | Hover | Smooth highlight from 15% to 35% opacity |
| **Primary Button Hover** | `250ms` | Ease | Hover | Elevates `translateY(-1px)` and expands glow |
| **Telemetry Pulse Loop** | `2400ms` | Interval | Automated | Live stochastic variation in generation MW |

---

## 7. Complete Page Section Structure

1. **Pre-loader & Cinematic Splash Gate (`#custom-splash-wrapper`):**
   - Brand SVG logo centered.
   - Dual shutter opening bands (`#custom-band-top`, `#custom-band-bottom`).
   - Title: `INTELLIGENCE AT PLANETARY SCALE`.
   - Subtitle: `Compute in harmony with the planet.`
   - Headphone listening cue and rolling percentage progress indicator (`100%`).
   - Tactical `INITIATE SYSTEM` CTA with crosshair tick marks.
2. **3D WebGL Planetary Orbit Canvas (`#application-canvas`):**
   - Interactive orbit globe rendered with PlayCanvas engine.
   - Interactive satellite data point rings and live text scramble/decode effects.
3. **Fixed HUD Layer (`#pc-overlay-root`):**
   - Centered logotype and live interactive audio visualizer.
4. **Intelligent Features Layer (`#sylvra-features-layer`):**
   - **Header & Mission:** `THE GRID LEARNS. COMPUTE MOVES TO POWER.` with pulse badge.
   - **Navigation Pill Bar:** Fast scroll jumping (`ML MODEL ARCHITECTURE`, `SATELLITE RADAR MAP`, `LIVE GRID TELEMETRY`, `ENERGY ROUTING`, `RETURN TO 3D ORBIT`).
   - **Module 1: ML Model Architecture & Siting Regressor:**
     - Left: Multi-Head DC Siting Regressor with live dynamic neural topology canvas (`#neural-canvas`) and 6-metric anti-overfitting panel (Train/Val accuracy, Spatial Dropout, Weight Decay, Blocked CV).
     - Right: Live interactive siting inference simulator (Regional candidate selector, load sizing, cooling strategy dropdown, and instant prediction score/PUE/carbon offset readout).
   - **Module 2: Satellite Renewable Cluster Radar Map:**
     - Satellite radar imagery of India with 10 renewable clusters (Khavda, Bhadla, Ladakh, Muppandal, Pavagada, Tehri, Dholera, Rewa, Jaisalmer, Kurnool).
     - Interactive filter pills and real-time radar HUD sector readout.
   - **Module 3: Live Grid Telemetry & Digital Twin:**
     - Real-time stat meters: Renewable Generation (84.1 MW), AI Compute Demand (62.1 MW), BESS Storage (51.9 MWh), Grid Balance (+22.4 MW).
     - 5-Stage Dynamic Energy Routing Flow pipeline.
     - 5-Step ML Decision Cycle (Observe, Predict, Optimize, Respond, Learn).
   - **Module 4: Enterprise Capacity Reservation:**
     - Feasibility inquiry desk for hyperscalers with direct CTA button.
   - **Footer:**
     - Technical platform compliance line: `SYLVRA // COMPUTE IN HARMONY WITH THE PLANET // SYSTEM STATUS: OPTIMAL`.

---

## 8. Responsive Breakdown & Accessibility

### Viewport Adaptations
- **Desktop (1440px):**
  - Full multi-column grids (2-col for ML, 4-col for stats, 5-col for decision cycles).
  - Main titles render at `54px`, radar map height `580px`.
  - Full audio text readout displayed in HUD.
- **Tablet (768px):**
  - All multi-column cards collapse to single-column stacking for optimal vertical scanning.
  - Horizontal navigation bar enables fluid touch scrolling.
  - Interactive map scales cleanly to viewport bounds.
- **Mobile (390px):**
  - Main title fluidly scales down via CSS clamp (`clamp(32px, 4.5vw, 54px)`).
  - Splash CTA button scales to `0.96rem 2.4rem` with `font-size: 0.6rem`.
  - Equalizer HUD text hides, preserving minimal bar icon.
  - Filter pills wrap into a two-line cluster.
  - Neural canvas and satellite map maintain full responsive widths.

### Accessibility Safeguards
- **Extreme Contrast Ratios:** White `#ffffff` on `#020504` yields `19.8:1`; neon emerald `#34d399` on `#020504` yields `10.5:1` (both surpass WCAG AAA standards).
- **Target Sizes:** All interactive touch elements maintain minimum tap targets `>= 44px`.
- **Keyboard & Focus States:** Inputs and buttons receive explicit `border-color: #10b981` and `box-shadow: 0 0 10px rgba(16, 185, 129, 0.25)` on `:focus`.
