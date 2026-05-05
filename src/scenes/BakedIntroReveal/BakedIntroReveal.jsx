import React from "react";
import { usePrefersReducedMotion } from "../../utils/usePrefersReducedMotion";
import { BakedIntroArt } from "./BakedIntroArt";
import {
  INTRO_DEBUG_STATES,
  useBakedIntroGeometry,
  useBakedIntroRefs,
  useQuerySceneState,
  useViewportSize
} from "./bakedIntroShared";
import { useBakedIntroAnimation } from "./useBakedIntroAnimation";
import "./BakedIntroReveal.css";

export function BakedIntroReveal({ onComplete, onHeroRevealStart }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const refs = useBakedIntroRefs();
  const {
    rootRef,
    backdropRef,
    logoRef,
    progressRef,
    progressFillRef,
    leftPanelGroupRef,
    rightPanelGroupRef,
    leftContentGroupRef,
    rightContentGroupRef,
    leftSeamCapRef,
    rightSeamCapRef,
    rightShadowRef,
    leftFragmentRefs,
    rightFragmentRefs
  } = refs;
  const viewportSize = useViewportSize();
  const sceneState = useQuerySceneState("introDebug", "live", INTRO_DEBUG_STATES);
  const geometry = useBakedIntroGeometry(viewportSize);

  useBakedIntroAnimation({
    refs,
    geometry,
    sceneState,
    prefersReducedMotion,
    onComplete,
    onHeroRevealStart,
    fadeBackdropOnExit: true
  });

  return (
    <section
      ref={rootRef}
      className="baked-intro-reveal"
      data-scene="intro"
      data-intro-debug={sceneState}
      aria-label="Lounge Coffee baked intro loader"
    >
      <div className="baked-intro-reveal__stage">
        <div ref={backdropRef} className="baked-intro-reveal__backdrop" aria-hidden="true" />
        <BakedIntroArt
          prefix="baked-intro-reveal"
          geometry={geometry}
          leftPanelGroupRef={leftPanelGroupRef}
          rightPanelGroupRef={rightPanelGroupRef}
          leftContentGroupRef={leftContentGroupRef}
          rightContentGroupRef={rightContentGroupRef}
          leftSeamCapRef={leftSeamCapRef}
          rightSeamCapRef={rightSeamCapRef}
          rightShadowRef={rightShadowRef}
          leftFragmentRefs={leftFragmentRefs}
          rightFragmentRefs={rightFragmentRefs}
          logoRef={logoRef}
          progressRef={progressRef}
          progressFillRef={progressFillRef}
        />
      </div>
    </section>
  );
}
