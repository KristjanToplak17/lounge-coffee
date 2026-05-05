import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { assetMap } from "../../utils/assetMap";
import { usePrefersReducedMotion } from "../../utils/usePrefersReducedMotion";
import leftPanelAsset from "../../../assets/test/left-reveal.svg";
import rightPanelAsset from "../../../assets/test/right-reveal.svg";
import leftBeanAsset from "../../../assets/test/coffeeBean-left.webp";
import rightBeanAsset from "../../../assets/test/coffeeBean-right.webp";
import "./BakedIntroReveal.css";

const DESIGN_HEIGHT = 1080;
const LEFT_PANEL_DESIGN_WIDTH = 1010;
const RIGHT_PANEL_DESIGN_WIDTH = 1010;
const START_OVERLAP_DESIGN_PX = 74;
const MID_TRAVEL_DESIGN_PX = 96;
const MID_SCALE = 1.16;
const END_SCALE = 6.0;
const LOADER_TIMING = {
  initialHold: 0.2,
  loaderFill: 1,
  loaderCompleteHold: 0.4,
  loaderFade: 0.35,
  startToMid: 1.5,
  midHold: 0.4,
  midToEnd: 2.3
};
const REDUCED_TIMING = {
  initialHold: 0.08,
  loaderFill: 0.35,
  loaderCompleteHold: 0.08,
  loaderFade: 0.18,
  startToMid: 0.45,
  midHold: 0.05,
  midToEnd: 0.6
};
const EASE = {
  loaderFade: "cubic-bezier(0.4, 1, 0.5, 1)",
  startToMid: "cubic-bezier(0.4, 1, 0.5, 1)",
  midToEnd: "cubic-bezier(0.7, 0.2, 0.5, 1)"
};
const LEFT_BEAN = {
  left: 867,
  top: 401,
  width: 124,
  height: 278
};
const RIGHT_BEAN = {
  left: -1,
  top: 403,
  width: 123,
  height: 273
};
const LOGO = {
  top: 116,
  width: 92,
  height: 92
};
const PROGRESS = {
  top: 750,
  width: 256,
  height: 6
};
const SHADOWS = {
  right: {
    right: -156,
    top: 0,
    width: 600,
    height: 400,
    opacity: 0.1
  }
};
const FRAGMENTS = {
  left: [
    { left: 820, top: 400, width: 36, height: 40, xMid: -16, yMid: -24, rotationMid: -16, xEnd: -42, yEnd: -58, rotationEnd: -34 },
    { left: 770, top: 464, width: 28, height: 32, xMid: -22, yMid: -6, rotationMid: -20, xEnd: -52, yEnd: -10, rotationEnd: -48 },
    { left: 820, top: 550, width: 26, height: 30, xMid: -24, yMid: 18, rotationMid: -18, xEnd: -56, yEnd: 44, rotationEnd: -40 },
    { left: 780, top: 620, width: 40, height: 44, xMid: -18, yMid: 30, rotationMid: -14, xEnd: -48, yEnd: 68, rotationEnd: -30 }
  ],
  right: [
    { left: 140, top: 404, width: 38, height: 40, xMid: 16, yMid: -26, rotationMid: 16, xEnd: 42, yEnd: -56, rotationEnd: 34 },
    { left: 126, top: 472, width: 26, height: 28, xMid: 24, yMid: -4, rotationMid: 18, xEnd: 50, yEnd: -8, rotationEnd: 42 },
    { left: 190, top: 544, width: 28, height: 30, xMid: 24, yMid: 20, rotationMid: 16, xEnd: 54, yEnd: 46, rotationEnd: 38 },
    { left: 130, top: 602, width: 38, height: 42, xMid: 18, yMid: 28, rotationMid: 14, xEnd: 46, yEnd: 64, rotationEnd: 30 }
  ]
};

function getViewportSize() {
  if (typeof window === "undefined") {
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function getIntroDebugStateFromLocation() {
  if (typeof window === "undefined") {
    return "live";
  }

  const params = new URLSearchParams(window.location.search);
  const state = params.get("introDebug");

  if (state === "start" || state === "mid" || state === "end") {
    return state;
  }

  return "live";
}

function useViewportSize() {
  const [viewportSize, setViewportSize] = useState(getViewportSize);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const updateViewportSize = () => {
      setViewportSize(getViewportSize());
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  return viewportSize;
}

function useIntroDebugState() {
  const [sceneState, setSceneState] = useState(getIntroDebugStateFromLocation);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const updateState = () => {
      setSceneState(getIntroDebugStateFromLocation());
    };

    updateState();
    window.addEventListener("popstate", updateState);

    return () => window.removeEventListener("popstate", updateState);
  }, []);

  return sceneState;
}

function getFragmentStyles(fragment, artScale) {
  return {
    left: fragment.left * artScale,
    top: fragment.top * artScale,
    width: fragment.width * artScale,
    height: fragment.height * artScale
  };
}

function getScaledFragmentMotion(fragment, artScale) {
  return {
    xMid: fragment.xMid * artScale,
    yMid: fragment.yMid * artScale,
    xEnd: fragment.xEnd * artScale,
    yEnd: fragment.yEnd * artScale,
    rotationMid: fragment.rotationMid,
    rotationEnd: fragment.rotationEnd
  };
}

function setFragmentState(elements, fragments, artScale, state) {
  elements.forEach((element, index) => {
    const fragment = fragments[index];
    const motion = getScaledFragmentMotion(fragment, artScale);

    if (!element) {
      return;
    }

    if (state === "start") {
      gsap.set(element, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 0.92 });
      return;
    }

    if (state === "mid") {
      gsap.set(element, {
        opacity: 0.9,
        x: motion.xMid,
        y: motion.yMid,
        rotation: motion.rotationMid,
        scale: 1
      });
      return;
    }

    gsap.set(element, {
      opacity: 0,
      x: motion.xEnd,
      y: motion.yEnd,
      rotation: motion.rotationEnd,
      scale: 1.04
    });
  });
}

export function BakedIntroReveal({ onComplete, onHeroRevealStart }) {
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const progressFillRef = useRef(null);
  const heroRevealStartedRef = useRef(false);
  const leftPanelGroupRef = useRef(null);
  const rightPanelGroupRef = useRef(null);
  const leftContentGroupRef = useRef(null);
  const rightContentGroupRef = useRef(null);
  const leftSeamCapRef = useRef(null);
  const rightSeamCapRef = useRef(null);
  const rightShadowRef = useRef(null);
  const leftFragmentRefs = useRef([]);
  const rightFragmentRefs = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewportSize = useViewportSize();
  const sceneState = useIntroDebugState();

  const geometry = useMemo(() => {
    const artScale = viewportSize.height / DESIGN_HEIGHT;
    const leftPanelWidth = LEFT_PANEL_DESIGN_WIDTH * artScale;
    const rightPanelWidth = RIGHT_PANEL_DESIGN_WIDTH * artScale;
    const panelHeight = DESIGN_HEIGHT * artScale;
    const centerX = viewportSize.width / 2;
    const startOverlapPx = START_OVERLAP_DESIGN_PX * artScale;
    const leftStartX = centerX - leftPanelWidth + startOverlapPx / 2;
    const rightStartX = centerX - startOverlapPx / 2;
    const leftExtensionWidth = Math.max(0, leftStartX);
    const rightExtensionWidth = Math.max(0, viewportSize.width - (rightStartX + rightPanelWidth));
    const seamCapWidth = 116 * artScale;
    const midTravel = MID_TRAVEL_DESIGN_PX * artScale;
    const exitDistance = Math.max(viewportSize.width, leftPanelWidth, rightPanelWidth) * 1.1;
    const leftEndX = leftStartX - exitDistance;
    const rightEndX = rightStartX + exitDistance;

    return {
      artScale,
      panelHeight,
      startOverlapPx,
      midTravel,
      leftStartX,
      rightStartX,
      leftEndX,
      rightEndX,
      logo: {
        top: LOGO.top * artScale,
        width: LOGO.width * artScale,
        height: LOGO.height * artScale
      },
      progress: {
        top: PROGRESS.top * artScale,
        width: PROGRESS.width * artScale,
        height: Math.max(3, PROGRESS.height * artScale)
      },
      leftGroup: {
        left: leftStartX,
        width: leftPanelWidth,
        extensionWidth: leftExtensionWidth,
        seamCapWidth
      },
      rightGroup: {
        left: rightStartX,
        width: rightPanelWidth,
        extensionWidth: rightExtensionWidth,
        seamCapWidth
      },
      leftBean: {
        left: LEFT_BEAN.left * artScale,
        top: LEFT_BEAN.top * artScale,
        width: LEFT_BEAN.width * artScale,
        height: LEFT_BEAN.height * artScale
      },
      rightBean: {
        left: RIGHT_BEAN.left * artScale,
        top: RIGHT_BEAN.top * artScale,
        width: RIGHT_BEAN.width * artScale,
        height: RIGHT_BEAN.height * artScale
      },
      shadows: {
        right: {
          right: SHADOWS.right.right * artScale,
          top: SHADOWS.right.top * artScale,
          width: SHADOWS.right.width * artScale,
          height: SHADOWS.right.height * artScale,
          opacity: SHADOWS.right.opacity
        }
      }
    };
  }, [viewportSize.height, viewportSize.width]);

  useLayoutEffect(() => {
    const leftPanelGroup = leftPanelGroupRef.current;
    const rightPanelGroup = rightPanelGroupRef.current;
    const leftContentGroup = leftContentGroupRef.current;
    const rightContentGroup = rightContentGroupRef.current;
    const rightShadow = rightShadowRef.current;
    const leftSeamCap = leftSeamCapRef.current;
    const rightSeamCap = rightSeamCapRef.current;
    const leftFragments = leftFragmentRefs.current;
    const rightFragments = rightFragmentRefs.current;

    if (
      !leftPanelGroup ||
      !rightPanelGroup ||
      !leftContentGroup ||
      !rightContentGroup ||
      !leftSeamCap ||
      !rightSeamCap ||
      !backdropRef.current ||
      !rightShadow ||
      !logoRef.current ||
      !progressRef.current ||
      !progressFillRef.current
    ) {
      return undefined;
    }

    let cancelled = false;
    heroRevealStartedRef.current = false;

    const timing = prefersReducedMotion ? REDUCED_TIMING : LOADER_TIMING;

    const triggerHeroReveal = () => {
      if (heroRevealStartedRef.current) {
        return;
      }

      heroRevealStartedRef.current = true;
      onHeroRevealStart?.();
    };

    const ctx = gsap.context(() => {
      const leftTargets = [leftPanelGroup, leftContentGroup];
      const rightTargets = [rightPanelGroup, rightContentGroup];
      const groups = [
        { elements: leftTargets, endX: geometry.leftEndX - geometry.leftStartX },
        { elements: rightTargets, endX: geometry.rightEndX - geometry.rightStartX }
      ];
      const allFragments = [
        { elements: leftFragments, geometry: FRAGMENTS.left },
        { elements: rightFragments, geometry: FRAGMENTS.right }
      ];

      gsap.killTweensOf([
        logoRef.current,
        progressRef.current,
        progressFillRef.current,
        backdropRef.current,
        ...leftTargets,
        ...rightTargets,
        leftSeamCap,
        rightSeamCap,
        rightShadow,
        ...leftFragments,
        ...rightFragments
      ]);

      gsap.set(progressFillRef.current, { scaleX: 0 });
      gsap.set(progressRef.current, { opacity: 1 });
      gsap.set(logoRef.current, { opacity: 0.96, y: 0 });
      gsap.set(backdropRef.current, { opacity: 1 });
      gsap.set(leftTargets, { x: 0, scale: 1, transformOrigin: "100% 50%" });
      gsap.set(rightTargets, { x: 0, scale: 1, transformOrigin: "0% 50%" });
      gsap.set(leftSeamCap, { opacity: 1 });
      gsap.set(rightSeamCap, { opacity: 1 });
      gsap.set(rightShadow, { opacity: geometry.shadows.right.opacity, x: 0, y: 0, scale: 1 });
      allFragments.forEach(({ elements, geometry: fragmentGeometry }) => {
        setFragmentState(elements, fragmentGeometry, geometry.artScale, "start");
      });

      if (sceneState === "start") {
        return;
      }

      if (sceneState === "mid") {
        gsap.set(progressFillRef.current, { scaleX: 1 });
        gsap.set(progressRef.current, { opacity: 0 });
        gsap.set(logoRef.current, { opacity: 0, y: -10 * geometry.artScale });
        gsap.set(backdropRef.current, { opacity: 1 });
        gsap.set(leftTargets, { x: -geometry.midTravel, scale: MID_SCALE });
        gsap.set(rightTargets, { x: geometry.midTravel, scale: MID_SCALE });
        gsap.set(leftSeamCap, { opacity: 0 });
        gsap.set(rightSeamCap, { opacity: 0 });
        gsap.set(rightShadow, {
          opacity: geometry.shadows.right.opacity * 1.08,
          x: 36 * geometry.artScale,
          y: 8 * geometry.artScale,
          scale: 1.08
        });
        allFragments.forEach(({ elements, geometry: fragmentGeometry }) => {
          setFragmentState(elements, fragmentGeometry, geometry.artScale, "mid");
        });
        return;
      }

      if (sceneState === "end") {
        gsap.set(progressFillRef.current, { scaleX: 1 });
        gsap.set(progressRef.current, { opacity: 0 });
        gsap.set(logoRef.current, { opacity: 0, y: -12 * geometry.artScale });
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set(leftSeamCap, { opacity: 0 });
        gsap.set(rightSeamCap, { opacity: 0 });
        groups.forEach(({ elements, endX }) => {
          gsap.set(elements, { x: endX, scale: END_SCALE });
        });
        gsap.set(rightShadow, { opacity: 0, x: 108 * geometry.artScale, y: 22 * geometry.artScale, scale: 1.22 });
        allFragments.forEach(({ elements, geometry: fragmentGeometry }) => {
          setFragmentState(elements, fragmentGeometry, geometry.artScale, "end");
        });
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          if (!cancelled) {
            onComplete?.();
          }
        }
      });

      timeline.to(progressFillRef.current, {
        duration: timing.loaderFill,
        scaleX: 1,
        ease: "none"
      }, timing.initialHold);
      timeline.to(progressRef.current, {
        duration: timing.loaderFade,
        opacity: 0,
        ease: EASE.loaderFade
      }, timing.initialHold + timing.loaderFill + timing.loaderCompleteHold);
      timeline.to(logoRef.current, {
        duration: timing.loaderFade,
        opacity: 0,
        y: -10 * geometry.artScale,
        ease: EASE.loaderFade
      }, "<");
      timeline.to([leftSeamCap, rightSeamCap], {
        duration: timing.loaderFade,
        opacity: 0,
        ease: EASE.loaderFade
      }, "<");
      timeline.to(leftTargets, {
        duration: timing.startToMid,
        x: -geometry.midTravel,
        scale: MID_SCALE,
        ease: EASE.startToMid
      }, "<");
      timeline.to(rightTargets, {
        duration: timing.startToMid,
        x: geometry.midTravel,
        scale: MID_SCALE,
        ease: EASE.startToMid
      }, "<");
      timeline.to(rightShadow, {
        duration: timing.startToMid,
        opacity: geometry.shadows.right.opacity * 1.08,
        x: 36 * geometry.artScale,
        y: 8 * geometry.artScale,
        scale: 1.08,
        ease: EASE.startToMid
      }, "<");

      allFragments.forEach(({ elements, geometry: fragmentGeometry }) => {
        elements.forEach((element, index) => {
          const motion = getScaledFragmentMotion(fragmentGeometry[index], geometry.artScale);
          timeline.to(element, {
            duration: timing.startToMid,
            opacity: 0.9,
            x: motion.xMid,
            y: motion.yMid,
            rotation: motion.rotationMid,
            scale: 1,
            ease: EASE.startToMid
          }, "<");
        });
      });

      timeline.to({}, { duration: timing.midHold });

      timeline.addLabel("midToEnd");
      timeline.call(triggerHeroReveal, null, "midToEnd");
      timeline.to(backdropRef.current, {
        duration: timing.midToEnd,
        opacity: 0,
        ease: EASE.midToEnd
      }, "midToEnd");

      timeline.to(leftTargets, {
        duration: timing.midToEnd,
        x: geometry.leftEndX - geometry.leftStartX,
        scale: END_SCALE,
        ease: EASE.midToEnd
      }, "midToEnd");
      timeline.to(rightTargets, {
        duration: timing.midToEnd,
        x: geometry.rightEndX - geometry.rightStartX,
        scale: END_SCALE,
        ease: EASE.midToEnd
      }, "midToEnd");
      timeline.to(rightShadow, {
        duration: timing.midToEnd,
        opacity: 0,
        x: 108 * geometry.artScale,
        y: 22 * geometry.artScale,
        scale: 1.22,
        ease: EASE.midToEnd
      }, "midToEnd");

      allFragments.forEach(({ elements, geometry: fragmentGeometry }) => {
        elements.forEach((element, index) => {
          const motion = getScaledFragmentMotion(fragmentGeometry[index], geometry.artScale);
          timeline.to(element, {
            duration: timing.midToEnd,
            opacity: 0,
            x: motion.xEnd,
            y: motion.yEnd,
            rotation: motion.rotationEnd,
            scale: 1.04,
            ease: EASE.midToEnd
          }, "midToEnd");
        });
      });
    }, rootRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [geometry, onComplete, onHeroRevealStart, prefersReducedMotion, sceneState]);

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

        <div className="baked-intro-reveal__split-scene" aria-hidden="true">
          <div
            ref={leftPanelGroupRef}
            className="baked-intro-reveal__group baked-intro-reveal__group--left baked-intro-reveal__group--panel"
            style={{
              left: `${geometry.leftGroup.left}px`,
              width: `${geometry.leftGroup.width}px`,
              height: `${geometry.panelHeight}px`
            }}
          >
            {geometry.leftGroup.extensionWidth > 0 ? (
              <div
                className="baked-intro-reveal__extension baked-intro-reveal__extension--left"
                style={{
                  left: `${-geometry.leftGroup.extensionWidth}px`,
                  width: `${geometry.leftGroup.extensionWidth}px`,
                  height: `${geometry.panelHeight}px`
                }}
              />
            ) : null}

            <div
              ref={leftSeamCapRef}
              className="baked-intro-reveal__seam-cap baked-intro-reveal__seam-cap--left"
              style={{
                left: `${geometry.leftGroup.width - geometry.leftGroup.seamCapWidth}px`,
                width: `${geometry.leftGroup.seamCapWidth}px`,
                height: `${geometry.panelHeight}px`
              }}
            />

            <img
              className="baked-intro-reveal__panel"
              src={leftPanelAsset}
              alt=""
              draggable="false"
              style={{
                width: `${geometry.leftGroup.width}px`,
                height: `${geometry.panelHeight}px`
              }}
            />
          </div>

          <div
            ref={rightPanelGroupRef}
            className="baked-intro-reveal__group baked-intro-reveal__group--right baked-intro-reveal__group--panel"
            style={{
              left: `${geometry.rightGroup.left}px`,
              width: `${geometry.rightGroup.width}px`,
              height: `${geometry.panelHeight}px`
            }}
          >
            {geometry.rightGroup.extensionWidth > 0 ? (
              <div
                className="baked-intro-reveal__extension baked-intro-reveal__extension--right"
                style={{
                  left: `${geometry.rightGroup.width}px`,
                  width: `${geometry.rightGroup.extensionWidth}px`,
                  height: `${geometry.panelHeight}px`
                }}
              />
            ) : null}

            <div
              ref={rightSeamCapRef}
              className="baked-intro-reveal__seam-cap baked-intro-reveal__seam-cap--right"
              style={{
                left: "0px",
                width: `${geometry.rightGroup.seamCapWidth}px`,
                height: `${geometry.panelHeight}px`
              }}
            />

            <img
              className="baked-intro-reveal__panel"
              src={rightPanelAsset}
              alt=""
              draggable="false"
              style={{
                width: `${geometry.rightGroup.width}px`,
                height: `${geometry.panelHeight}px`
              }}
            />

            <img
              ref={rightShadowRef}
              className="baked-intro-reveal__shadow baked-intro-reveal__shadow--right"
              src={assetMap.shadows.coffeeLeaf}
              alt=""
              draggable="false"
              style={{
                right: `${geometry.shadows.right.right}px`,
                top: `${geometry.shadows.right.top}px`,
                width: `${geometry.shadows.right.width}px`,
                height: `${geometry.shadows.right.height}px`
              }}
            />
          </div>

          <div
            ref={leftContentGroupRef}
            className="baked-intro-reveal__group baked-intro-reveal__group--left baked-intro-reveal__group--content"
            style={{
              left: `${geometry.leftGroup.left}px`,
              width: `${geometry.leftGroup.width}px`,
              height: `${geometry.panelHeight}px`
            }}
          >
            {assetMap.beanFragments.left.map((fragment, index) => {
              const styles = getFragmentStyles(FRAGMENTS.left[index], geometry.artScale);

              return (
                <img
                  key={`left-fragment-${index + 1}`}
                  ref={(node) => {
                    leftFragmentRefs.current[index] = node;
                  }}
                  className="baked-intro-reveal__fragment baked-intro-reveal__fragment--left"
                  src={fragment}
                  alt=""
                  draggable="false"
                  style={{
                    left: `${styles.left}px`,
                    top: `${styles.top}px`,
                    width: `${styles.width}px`,
                    height: `${styles.height}px`
                  }}
                />
              );
            })}

            <img
              className="baked-intro-reveal__bean"
              src={leftBeanAsset}
              alt=""
              draggable="false"
              style={{
                left: `${geometry.leftBean.left}px`,
                top: `${geometry.leftBean.top}px`,
                width: `${geometry.leftBean.width}px`,
                height: `${geometry.leftBean.height}px`
              }}
            />
          </div>

          <div
            ref={rightContentGroupRef}
            className="baked-intro-reveal__group baked-intro-reveal__group--right baked-intro-reveal__group--content"
            style={{
              left: `${geometry.rightGroup.left}px`,
              width: `${geometry.rightGroup.width}px`,
              height: `${geometry.panelHeight}px`
            }}
          >
            {assetMap.beanFragments.right.map((fragment, index) => {
              const styles = getFragmentStyles(FRAGMENTS.right[index], geometry.artScale);

              return (
                <img
                  key={`right-fragment-${index + 1}`}
                  ref={(node) => {
                    rightFragmentRefs.current[index] = node;
                  }}
                  className="baked-intro-reveal__fragment baked-intro-reveal__fragment--right"
                  src={fragment}
                  alt=""
                  draggable="false"
                  style={{
                    left: `${styles.left}px`,
                    top: `${styles.top}px`,
                    width: `${styles.width}px`,
                    height: `${styles.height}px`
                  }}
                />
              );
            })}

            <img
              className="baked-intro-reveal__bean"
              src={rightBeanAsset}
              alt=""
              draggable="false"
              style={{
                left: `${geometry.rightBean.left}px`,
                top: `${geometry.rightBean.top}px`,
                width: `${geometry.rightBean.width}px`,
                height: `${geometry.rightBean.height}px`
              }}
            />
          </div>
        </div>

        <div className="baked-intro-reveal__loader-ui">
          <img
            ref={logoRef}
            className="baked-intro-reveal__logo"
            src={assetMap.logos.light}
            alt=""
            draggable="false"
            style={{
              top: `${geometry.logo.top}px`,
              width: `${geometry.logo.width}px`,
              height: `${geometry.logo.height}px`
            }}
          />

          <div
            ref={progressRef}
            className="baked-intro-reveal__progress"
            style={{
              top: `${geometry.progress.top}px`,
              width: `${geometry.progress.width}px`,
              height: `${geometry.progress.height}px`
            }}
          >
            <div ref={progressFillRef} className="baked-intro-reveal__progress-fill" />
          </div>
        </div>
      </div>
    </section>
  );
}
