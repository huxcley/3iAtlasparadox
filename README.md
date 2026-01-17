# 3i ATLAS PARADOX

An immersive, interactive scientific narrative experience built with React, TypeScript, and Framer Motion.

## Project Overview

This project presents a cinematic, data-driven storytelling experience about the discovery of an interstellar object. Users navigate through 8 narrative pages featuring:

- **Intro sequence** with looping video presentations
- **Interactive page navigation** with smooth transitions
- **Scientific data visualizations** using Recharts
- **Premium glassmorphism UI** with neon accents
- **Responsive design** for desktop and mobile

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Required Assets

Place the following files in the `/public` directory:

- `avra3.png` - Hero background image
- `avra1.mp4` - First intro video
- `avra2.mp4` - Second intro video

## Project Structure

```
3i-atlas-paradox/
├── public/           # Static assets (videos, images)
├── src/
│   ├── App.tsx      # Main application component
│   ├── main.tsx     # React entry point
│   └── index.css    # Global styles
├── index.html       # HTML entry point
└── package.json     # Dependencies
```

## Features

- **Intro Screen**: Sequential video player with auto-loop
- **8 Narrative Pages**: Each with unique theme and content
- **Scientific Charts**: Interactive data visualization on page 5
- **Glitch Effects**: Hover effects on titles
- **Progress Tracking**: Visual progress bar and page indicators
- **Responsive Navigation**: Touch-friendly controls

## Customization

Edit `NARRATIVE_DATA` in `App.tsx` to modify story content, themes, and scientific data displays.

## License

MIT
