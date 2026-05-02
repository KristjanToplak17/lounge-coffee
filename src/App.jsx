import React, { useEffect, useState } from "react";
import { IntroReveal } from "./scenes/IntroReveal/IntroReveal";
import { assetMap } from "./utils/assetMap";
import { usePrefersReducedMotion } from "./utils/usePrefersReducedMotion";

const INTRO_PRELOAD_SOURCES = [
  assetMap.logos.dark,
  assetMap.logos.light,
  assetMap.revealPanels.left,
  assetMap.revealPanels.right,
  assetMap.beans.left,
  assetMap.beans.right,
  assetMap.shadows.coffeeLeaf,
  ...assetMap.beanFragments.left,
  ...assetMap.beanFragments.right
];

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const preloadedImages = INTRO_PRELOAD_SOURCES.map((source) => {
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
      data-current-scene={introComplete ? "underlay" : "intro"}
      data-intro-complete={introComplete ? "true" : "false"}
      data-motion-profile={prefersReducedMotion ? "reduced" : "full"}
    >
      <div className="app-shell__underlay" aria-hidden="true">
        <div className="app-shell__underlay-haze app-shell__underlay-haze--top" />
        <div className="app-shell__underlay-haze app-shell__underlay-haze--bottom" />
        <img
          className="app-shell__underlay-logo"
          src={assetMap.logos.dark}
          alt=""
        />
      </div>

      {!introComplete && (
        <IntroReveal onComplete={() => setIntroComplete(true)} />
      )}
    </main>
  );
}
