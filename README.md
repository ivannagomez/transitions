# Transitions - React + Tailwind Project

A study on viewport transition coding, AI image model training, and creative world building.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Images
Place your images in the following structure:
```
public/
└── images/
    └── transition-study/
        ├── bgd-2.png through bgd-9.png
        ├── bgds-1.png through bgds-9.png
        └── pp-1.png through pp-9.png
```

### 3. Add Fonts
Place the `Yipes Regular.otf` font file in:
```
public/
└── fonts/
    └── Yipes Regular.otf
```

### 4. Run Development Server
```bash
npm run dev
```

## Project Structure

- **src/components/** - React components (Scene, PPImage, SceneText, LandingTitle)
- **src/hooks/** - Custom React hooks (useIntersectionObserver)
- **src/data/** - Scene configuration data
- **src/App.jsx** - Main application component with scroll logic
- **src/index.css** - Tailwind CSS and custom styles

## Features

- Scroll-based scene transitions
- PP images that slide up from bottom when scenes change
- Parallax text effects on scroll
- Custom font integration (IBM Plex Mono, Yipes Regular)
- Fully responsive design

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.
