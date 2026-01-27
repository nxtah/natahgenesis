# Copilot Instructions for Natah Genesis

## Architecture Overview
- **Frontend-Only React App**: Built with Vite for fast HMR. Focuses on scroll-driven storytelling for a creative digital studio website.
- **Key Components**: `App.jsx` orchestrates sections (Hero, Problem, Services) with WebGL background (`Canvas.jsx`, `Experience.js`). Navbar/Footer for navigation/CTAs.
- **Data Flow**: Minimal state; animations via GSAP ScrollTrigger. Hooks handle interactions (e.g., `useScrollFade` for fade effects).
- **Why Structure**: Premium UI with glassmorphism, asymmetric layouts, and cinematic scroll to enhance engagement and conversions (e.g., WhatsApp links).

## Developer Workflows
- **Build**: `npm run build` (Vite production build; watch for chunk size warnings >500kB).
- **Dev Server**: `npm run dev` (starts at http://localhost:5174; supports HMR).
- **Debugging**: Use browser console for GSAP/WebGL errors. Check ScrollTrigger timelines in dev tools. No test suite; validate animations manually.

## Project Conventions
- **Animations**: Use GSAP ScrollTrigger for scroll-based effects (e.g., pin sections in `ScrollTransitionSections.jsx`). Avoid native CSS animations; prefer GSAP for performance.
- **Styling**: Tailwind for responsive layout; custom CSS in `src/css/` for sections (e.g., `services.css`). CSS variables in `index.css` for theming (--white, --black, --blue).
- **Fonts**: 'Migra' for headings, 'NeueMontreal' for body. Loaded in `index.css`.
- **Hooks**: Custom hooks in `src/hooks/` for reusable effects (e.g., `useEntranceAnimation` for fade-ins). Follow pattern: return [ref, style].
- **WebGL**: Three.js in `src/webgl/` for ambient backgrounds. Shader files in `shaders/`; update uniforms in `Experience.js` for scroll sync.
- **CTAs**: WhatsApp links via `utils/whatsapp.js`. Integrate in buttons/navbar.
- **File Structure**: `src/components/` for UI, `src/sections/` for page parts, `src/utils/` for helpers. Avoid deep nesting.

## Integration Patterns
- **External Libs**: GSAP (animations), Three.js (WebGL), Framer Motion (micro-interactions), Tailwind (styling). Update `package.json` for new deps.
- **Cross-Component**: Use refs for GSAP targets. State via React hooks; avoid global state.
- **Scroll Handling**: `ScrollTransitionSections.jsx` manages section transitions. Use `useLockBodyScroll` to prevent body scroll during interactions.

## Examples
- Add scroll effect: Use `gsap.fromTo(element, {opacity:0}, {opacity:1, scrollTrigger: {trigger: element, start: "top 80%"}})` in `useEffect`.
- Custom hook: Follow `useScrollFade.js` pattern for Intersection Observer-based animations.
- Styling: Use `clamp(2rem, 5vw, 4rem)` for responsive font sizes in CSS.

Reference: `src/App.jsx` for app structure, `src/css/services.css` for section-specific styles.