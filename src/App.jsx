import React, { useCallback, useEffect, useRef, useState } from "react";
import { BakedIntroReveal } from "./scenes/BakedIntroReveal/BakedIntroReveal";
import { HeroComposition } from "./scenes/HeroComposition/HeroComposition";
import { TestRevealExperiment } from "./scenes/TestRevealExperiment/TestRevealExperiment";
import { assetMap } from "./utils/assetMap";
import { usePrefersReducedMotion } from "./utils/usePrefersReducedMotion";
import bakedLeftPanel from "../assets/test/left-reveal.svg";
import bakedRightPanel from "../assets/test/right-reveal.svg";
import bakedLeftBean from "../assets/test/coffeeBean-left.webp";
import bakedRightBean from "../assets/test/coffeeBean-right.webp";

const INTRO_PRELOAD_SOURCES = [
  assetMap.logos.light,
  assetMap.shadows.coffeeLeaf,
  bakedLeftPanel,
  bakedRightPanel,
  bakedLeftBean,
  bakedRightBean,
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
  const isTestRoute = typeof window !== "undefined" && window.location.pathname === "/test";
  const [introComplete, setIntroComplete] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroRevealRef = useRef(null);

  useEffect(() => {
    if (isTestRoute) {
      return undefined;
    }

    const preloadedImages = [...INTRO_PRELOAD_SOURCES, ...HERO_PRELOAD_SOURCES].map((source) => {
      const image = new Image();
      image.src = source;
      return image;
    });

    return () => {
      preloadedImages.length = 0;
    };
  }, [isTestRoute]);

  const handleHeroRevealStart = useCallback(() => {
    heroRevealRef.current?.playReveal();
  }, []);

  if (isTestRoute) {
    return <TestRevealExperiment />;
  }

  return (
    <main
      className="app-shell"
      data-app="lounge-coffee"
      data-current-scene={introComplete ? "hero" : "intro"}
      data-intro-complete={introComplete ? "true" : "false"}
      data-motion-profile={prefersReducedMotion ? "reduced" : "full"}
    >
      <HeroComposition ref={heroRevealRef} reducedMotion={prefersReducedMotion} />

      {!introComplete ? (
        <BakedIntroReveal
          onHeroRevealStart={handleHeroRevealStart}
          onComplete={() => setIntroComplete(true)}
        />
      ) : null}
    </main>
  );
}
