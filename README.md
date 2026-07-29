# INK DABBA Website

A poster-first studio site built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis
- Lucide React

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
```

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    about/page.tsx
    about/AboutClient.tsx
    contact/page.tsx
    spatial-design/page.tsx
    visuals/page.tsx
    work/page.tsx
    work/archive/page.tsx
    loading.tsx
    template.tsx
    robots.ts
    sitemap.ts
  components/
    global/
      CustomCursor.tsx
      FloatingBadge.tsx
      Footer.tsx
      Navigation.tsx
      Preloader.tsx
      SiteFooter.tsx
      SmoothScroll.tsx
    home/
      ClientSection.tsx
      ContactSection.tsx
      DifferenceSection.tsx
      FadeIn.tsx
      HeroSection.tsx
      ServicesSection.tsx
    motion/
      Magnetic.tsx
      MaskedHeading.tsx
      Reveal.tsx
      StaggerGroup.tsx
    sections/
      ContactFormCard.tsx
      ContactSection.tsx
      SelectedWorkSection.tsx
    ui/
      InteractiveEye.tsx
      LogoMarqueeWall.tsx
      infinite-grid-integration.tsx
      vertical-image-stack.tsx
  context/
    CursorContext.tsx
  data/
    site-content.ts
  hooks/
    usePointerField.ts
  lib/
    logo-assets.ts
    motion.ts
    seo.ts
public/
  image/
    logo/
  logo/
```

## Key Notes

- The homepage is composed in `src/app/page.tsx`.
- Homepage sections live in `src/components/home/`.
- Reusable UI primitives live in `src/components/ui/`.
- Logo/client imagery is organized inside `public/image/logo/`.
- Global motion helpers and reveal primitives live in `src/components/motion/`.

## Cleanup Status

This repository has been trimmed to remove old unused home components, generated image leftovers, duplicate logo assets, local build artifacts, and unused helper files that do not belong in the active source structure.
