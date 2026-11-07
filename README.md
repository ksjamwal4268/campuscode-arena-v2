# CampusCode Hackathon Arena & Mission Control

CampusCode is an advanced interactive platform engineered for national hackathons, builder portfolios, team orchestration, and mission control operations.

## Core Features
- **3D Flight Universe**: Interactive scroll-driven flight corridor powered by Three.js with floating monoliths, warp portals, and dynamic starfields.
- **Matrix Warp Role Loading**: Role-adaptive Warp Speed loading portal (`/initializing`) featuring holographic identity cards, dual glowing reactor rings, and real-time telemetry streaming for Student Builders, Organizer Directors, and Platform Overseers.
- **Obsidian Glass Architecture**: Cyberpunk-inspired UI with authentic obsidian depth, frosted blur backdrop, razor-sharp hairline borders, and role-reactive palettes:
  - **Student Builder**: Neon Lime (`#a8e62e`) & Electric Purple (`#7665ff`)
  - **Organizer Director**: Solar Amber (`#ffb800`) & Golden Tangerine (`#ff9100`)
  - **Administrator Overseer**: Electric Cyan (`#00f0ff`) & Cobalt Blue (`#526eff`)
- **Organizer & Admin Portals**: Full mission control dashboards for event management, team coordination, RuleBot AI guidelines, and platform oversight.
- **Aceternity Matrix Canvas**: Responsive falling cyber rain with interactive cursor-proximity excitation trail.
- **CometCards Perspective Tilt**: 3D gyroscope tilt cards with cursor-following radial glare.
- **Zero-Dependency Server & Vercel Native**: Standalone Node HTTP server and Vercel serverless functions with unified API routing.

## Quick Start

1. Start the server (Node.js runtime):
```bash
node server.js
```
2. Open your browser and navigate to:
```
http://localhost:3000
```
- Main Flight Landing: `http://localhost:3000/`
- Student Builder Portal: `http://localhost:3000/student`
- Organizer Mission Control: `http://localhost:3000/organizer`
- Administrator Overseer: `http://localhost:3000/admin`
- Matrix Warp Loading Engine: `http://localhost:3000/initializing`

## Tech Stack
- Frontend: Three.js, React 19 SPA, TailwindCSS, DM Mono, Inter
- Styling: Obsidian Glass Neo-Cyber with custom CSS variables
- Backend: Standalone Node.js HTTP/HTTPS server + Vercel Serverless Functions (`api/index.js`)
