# Harivansh Vats — Futuristic Cybernetic Portfolio Website

A completely custom, premium, futuristic personal portfolio website engineered from scratch for **Harivansh Vats** (AI Automation · Web Development · Data Analytics).

![Portfolio Preview](assets/images/ref_homepage_portrait.jpg)

---

## 🌟 Key Features

1. **Interactive Helmet Rider Reveal Effect (Core Signature Feature)**
   - Displays Harivansh Vats' original real-photo portrait by default.
   - Smooth feathered circular mask following the cursor in real time.
   - Reveals the futuristic cyberpunk rider (black helmet with glowing "HV" visor, green illuminated rider jacket, gauntlets) seamlessly over Harivansh's body.
   - Strictly bounded inside the portrait container with organic edge-blending into the dark cyber background.
   - High-tech glowing neon-green reticle HUD following the cursor with LERP (Linear Interpolation) fluid inertia.
   - Reverts smoothly back to the original photo whenever the mouse leaves the portrait stage.
   - Touch & mobile support with interactive tap/drag and a dedicated **Scan Cyber Helmet** toggle.

2. **Cinematic Cyber Aesthetic & Visuals**
   - Premium Silver White (`#FFFFFF`, `#E1E7F0`) and Cool Grey (`#BFC7D5`, `#8B9BB4`) palette on deep obsidian background (`#090B0F`).
   - Fine technical grid patterns and subtle ambient radial lighting.
   - Restrained ambient particle canvas floating gracefully in the background with interactive mouse reaction.
   - Typography powered by Google Fonts (*Outfit* and *JetBrains Mono*).
   - Glassmorphism, refined metallic corner brackets, and pulse status beacons.

3. **Homepage Layout (Exact Reference Alignment)**
   - **Navigation**: Custom SVG "HV" brand logo, navigation links with active scroll-spy, and a "Download Resume" action button.
   - **Hero Section**:
     - "HELLO, I'M" greeting with neon emerald bar
     - "Harivansh Vats" main heading with "Vats" highlighted in radiant neon emerald
     - "AI Automation · Web Development · Data Analytics" tagline
     - "I build digital solutions that solve real-world problems." description
     - "View My Work" (scrolls to `#projects`) and "Get In Touch" (scrolls to `#contact`) buttons
     - Glowing circular social icons for LinkedIn, GitHub, Email, and Portfolio
     - Animated "Scroll Down" mouse pill indicator near the lower center

4. **Complete Portfolio Sections**
   - **01. About Me**: Professional bio, 4 core competency pillars, animated live stats counters, and interactive tech stack matrix.
   - **02. Featured Projects**: Interactive category filter tabs (*All, AI Automation, Web Development, Data Analytics*), cyber card layouts, and architecture modals.
   - **03. Experience Timeline**: Vertical cyber timeline with glowing trace lines, pulsing nodes, and achievement bullet points.
   - **04. Verified Certifications**: Credential cards for DeepLearning.AI, Meta, Google, and AWS with interactive credential verification modal and one-click copy.
   - **05. Contact Section**: Live availability status beacon, direct channels (Email, LinkedIn, GitHub), and interactive cyber message transmission form with animated confirmation toasts.
   - **Footer**: Brand monogram, copyright, live system operational status, and smooth "Back to Top" trigger.

---

## 📁 Project Structure

```
myx/
├── index.html                 # Main website entry point
├── package.json               # Dependencies and scripts (Vite)
├── README.md                  # Project documentation
├── css/
│   ├── variables.css          # Design tokens, color palette, glowing tokens
│   ├── base.css               # Global reset, cyber grid, ambient glow
│   ├── navbar.css             # Fixed glass header, logo, navigation links
│   ├── hero.css               # Hero section typography, buttons, social links
│   ├── portrait.css           # Core Helmet Rider Reveal effect & Reticle HUD
│   ├── sections.css           # About, Projects, Experience, Certs, Contact, Footer
│   ├── modals.css             # Interactive modals and toast alerts
│   └── responsive.css         # Breakpoint adaptations (desktop, tablet, mobile)
├── js/
│   ├── main.js                # App coordinator, scroll-spy, animated counters
│   ├── reveal.js              # Circular mask LERP controller, boundary checks
│   ├── background.js          # Subtle ambient particles canvas
│   └── modals.js              # Case study modals, cert verification, toast
└── assets/
    ├── images/
    │   ├── portrait_human_final.png  # Base original portrait asset
    │   ├── portrait_rider_final.png  # Cyber helmet rider overlay asset
    │   ├── hv_logo.svg               # Custom brand SVG logo
    │   ├── favicon.svg               # Custom favicon
    │   ├── project_ai_agent.jpg      # Project thumbnail
    │   ├── project_analytics.jpg     # Project thumbnail
    │   ├── project_vision.jpg        # Project thumbnail
    │   └── project_web.jpg           # Project thumbnail
    └── resume/
        └── Harivansh_Vats_Resume.pdf # Real downloadable resume document
```

---

## 🚀 Running Locally

### Option 1: Using Vite (Recommended)

Make sure [Node.js](https://nodejs.org/) is installed:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Vite will start a local server at `http://localhost:5173/` with lightning-fast Hot Module Replacement (HMR).

### Option 2: Using Python's Built-in HTTP Server

```bash
python -m http.server 3000
```
Open `http://localhost:3000` in your web browser.

---

## 🛠️ Building for Production

To produce an optimized production bundle:

```bash
npm run build
```

The output will be placed in the `dist/` folder, ready for deployment to GitHub Pages, Vercel, Netlify, or any static hosting platform.

---

## ⚙️ Customization Guide

- **Social Links**: Update `index.html` within the `.hero-socials` container with your real LinkedIn, GitHub, and email links.
- **Resume**: Replace `assets/resume/Harivansh_Vats_Resume.pdf` with any updated resume PDF.
- **Projects & Experience**: Edit project details and career milestones directly in `index.html` and `js/modals.js`.
