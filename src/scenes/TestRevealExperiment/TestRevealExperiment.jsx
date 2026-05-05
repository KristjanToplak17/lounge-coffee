import React from "react";
import { BakedIntroArt } from "../BakedIntroReveal/BakedIntroArt";
import {
  TEST_REVEAL_STATES,
  updateQuerySceneState,
  useBakedIntroGeometry,
  useBakedIntroRefs,
  useQuerySceneState,
  useViewportSize
} from "../BakedIntroReveal/bakedIntroShared";
import { useBakedIntroAnimation } from "../BakedIntroReveal/useBakedIntroAnimation";
import "./TestRevealExperiment.css";

export function TestRevealExperiment() {
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
  const sceneState = useQuerySceneState("state", "live", TEST_REVEAL_STATES);
  const geometry = useBakedIntroGeometry(viewportSize);

  useBakedIntroAnimation({
    refs,
    geometry,
    sceneState,
    fadeBackdropOnExit: false
  });

  return (
    <main
      ref={rootRef}
      className="test-reveal-experiment"
      data-state={sceneState}
      aria-label="Baked loader reveal prototype"
    >
      <div ref={backdropRef} className="test-reveal-experiment__backdrop" aria-hidden="true" />

      <div className="test-reveal-experiment__viewport" aria-hidden="true">
        <div className="test-reveal-experiment__centerline" />
        <BakedIntroArt
          prefix="test-reveal-experiment"
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

      <div className="test-reveal-experiment__hud">
        <p className="test-reveal-experiment__title">Baked Loader Test</p>
        <p className="test-reveal-experiment__meta">
          state={sceneState} artScale={geometry.artScale.toFixed(4)} vh={viewportSize.height}px
        </p>
        <p className="test-reveal-experiment__meta">
          overlap={geometry.startOverlapPx.toFixed(2)}px exit={geometry.exitDistance.toFixed(2)}px
        </p>
        <p className="test-reveal-experiment__meta">
          extL={geometry.leftGroup.extensionWidth.toFixed(2)}px extR={geometry.rightGroup.extensionWidth.toFixed(2)}px
        </p>
        <div className="test-reveal-experiment__controls">
          <button type="button" onClick={() => updateQuerySceneState("state", "start")}>
            Start
          </button>
          <button type="button" onClick={() => updateQuerySceneState("state", "mid")}>
            Mid
          </button>
          <button type="button" onClick={() => updateQuerySceneState("state", "end")}>
            End
          </button>
          <button type="button" onClick={() => updateQuerySceneState("state", "live")}>
            Live
          </button>
        </div>
      </div>
    </main>
  );
}
