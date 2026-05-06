import React, { useCallback, useEffect, useRef, useState } from "react";
import { BakedIntroReveal } from "./scenes/BakedIntroReveal/BakedIntroReveal";
import { BestsellersSection } from "./scenes/BestsellersSection/BestsellersSection";
import { bakedIntroAssets } from "./scenes/BakedIntroReveal/bakedIntroAssets";
import { FreshnessTransition } from "./scenes/FreshnessTransition/FreshnessTransition";
import { HeroComposition } from "./scenes/HeroComposition/HeroComposition";
import { TestRevealExperiment } from "./scenes/TestRevealExperiment/TestRevealExperiment";
import { assetMap } from "./utils/assetMap";
import { usePrefersReducedMotion } from "./utils/usePrefersReducedMotion";
import { useSmoothScroll } from "./utils/useSmoothScroll";

const INTRO_PRELOAD_SOURCES = [
  assetMap.logos.light,
  assetMap.shadows.coffeeLeaf,
  bakedIntroAssets.leftPanelAsset,
  bakedIntroAssets.rightPanelAsset,
  bakedIntroAssets.leftBeanAsset,
  bakedIntroAssets.rightBeanAsset,
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

const appStyles = {
  shell: {
    position: "relative",
    minHeight: "100vh",
    minBlockSize: "100svh",
    isolation: "isolate",
    backgroundColor: "var(--color-cream-stage)"
  },
  introLocked: {
    height: "100vh",
    blockSize: "100svh",
    overflow: "hidden"
  },
  shellScrolled: {
    overflowX: "clip"
  },
  pageFlow: {
    position: "relative"
  },
  heroShell: {
    position: "relative",
    minHeight: "100vh",
    minBlockSize: "100svh",
    backgroundColor: "transparent"
  },
  overlayHost: {
    position: "fixed",
    inset: 0,
    zIndex: 14,
    pointerEvents: "none",
    overflow: "clip"
  },
  overlayCup: {
    position: "fixed",
    insetBlockStart: 0,
    insetInlineStart: 0,
    inlineSize: "var(--hero-cup-black-width)",
    opacity: 0,
    transformOrigin: "top left",
    willChange: "transform, opacity"
  },
  overlayCupBody: {
    position: "relative",
    transformOrigin: "center center",
    willChange: "transform"
  },
  overlayCupShadow: {
    position: "absolute",
    insetInlineStart: "50%",
    insetBlockEnd: "-9%",
    inlineSize: "46%",
    blockSize: "8.5%",
    borderRadius: "999px",
    background: "radial-gradient(ellipse at center, rgba(53, 21, 18, 0.22) 0%, rgba(53, 21, 18, 0.15) 42%, rgba(53, 21, 18, 0.06) 68%, rgba(53, 21, 18, 0) 100%)",
    filter: "blur(14px)",
    transform: "translateX(-50%)",
    opacity: 0.34
  },
  overlayCupImage: {
    position: "relative",
    zIndex: 1,
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    filter: "drop-shadow(var(--hero-cup-shadow))",
    userSelect: "none"
  }
};

export default function App() {
  const isTestRoute = typeof window !== "undefined" && window.location.pathname === "/test";
  const [introComplete, setIntroComplete] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroRevealRef = useRef(null);
  const transitionOverlayHostRef = useRef(null);
  const transitionCupRef = useRef(null);

  useSmoothScroll(introComplete && !prefersReducedMotion && !isTestRoute);

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
      style={{
        ...appStyles.shell,
        ...(introComplete ? appStyles.shellScrolled : appStyles.introLocked)
      }}
      data-app="lounge-coffee"
      data-current-scene={introComplete ? "hero" : "intro"}
      data-intro-complete={introComplete ? "true" : "false"}
      data-motion-profile={prefersReducedMotion ? "reduced" : "full"}
    >
      <div className="app-shell__page-flow" style={appStyles.pageFlow}>
        <section className="app-shell__hero-shell" style={appStyles.heroShell} aria-label="Hero poster shell">
          <HeroComposition ref={heroRevealRef} reducedMotion={prefersReducedMotion} />
        </section>

        <FreshnessTransition
          heroRevealRef={heroRevealRef}
          introComplete={introComplete}
          reducedMotion={prefersReducedMotion}
          overlayHostRef={transitionOverlayHostRef}
          overlayCupRef={transitionCupRef}
        />

        <BestsellersSection />
      </div>

      <div
        ref={transitionOverlayHostRef}
        className="app-shell__transition-overlay-host"
        style={appStyles.overlayHost}
        aria-hidden="true"
      >
        <div ref={transitionCupRef} className="app-shell__transition-cup" style={appStyles.overlayCup}>
          <div className="app-shell__transition-cup-body" style={appStyles.overlayCupBody}>
            <div className="app-shell__transition-cup-shadow" style={appStyles.overlayCupShadow} />
            <img
              className="app-shell__transition-cup-image"
              style={appStyles.overlayCupImage}
              src={assetMap.cups.black}
              alt=""
            />
          </div>
        </div>
      </div>

      {!introComplete ? (
        <BakedIntroReveal
          onHeroRevealStart={handleHeroRevealStart}
          onComplete={() => setIntroComplete(true)}
        />
      ) : null}
    </main>
  );
}
