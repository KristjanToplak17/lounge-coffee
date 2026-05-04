import React, { useEffect, useState } from "react";
import { IntroReveal } from "./scenes/IntroReveal/IntroReveal";
import { HeroComposition } from "./scenes/HeroComposition/HeroComposition";
import { assetMap } from "./utils/assetMap";
import { usePrefersReducedMotion } from "./utils/usePrefersReducedMotion";

const INTRO_PRELOAD_SOURCES = [
  assetMap.logos.light,
  assetMap.revealPanels.left,
  assetMap.revealPanels.right,
  assetMap.beans.full,
  assetMap.shadows.coffeeLeaf,
  ...assetMap.beanFragments.left,
  ...assetMap.beanFragments.right
];

const HERO_PRELOAD_SOURCES = [
  assetMap.logos.dark,
  assetMap.stickers.mascot,
  assetMap.cups.red,
  assetMap.cups.yellow,
  assetMap.cups.black,
  assetMap.cups.orange
];

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const preloadedImages = [...INTRO_PRELOAD_SOURCES, ...HERO_PRELOAD_SOURCES].map((source) => {
      const image = new Image();
      image.src = source;
      return image;
    });

    return () => {
      preloadedImages.length = 0;
    };
  }, []);

  return (
    <main
      className="app-shell"
      data-app="lounge-coffee"
      data-current-scene={introComplete ? "hero" : "intro"}
      data-intro-complete={introComplete ? "true" : "false"}
      data-motion-profile={prefersReducedMotion ? "reduced" : "full"}
    >
      <HeroComposition />

      {!introComplete && (
        <IntroReveal onComplete={() => setIntroComplete(true)} />
      )}
    </main>
  );
}
