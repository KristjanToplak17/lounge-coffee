import React, { createRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { introRevealTimeline } from "../../animations/introRevealTimeline";
import { assetMap } from "../../utils/assetMap";
import { getIntroRevealGeometry, REVEAL_SIDES } from "../../utils/motionConfig";
import { usePrefersReducedMotion } from "../../utils/usePrefersReducedMotion";
import "./IntroReveal.css";

function useViewportSize() {
  const [viewportSize, setViewportSize] = useState(() => {
    if (typeof window === "undefined") {
      return { width: 1440, height: 900 };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  return viewportSize;
}

function createFragmentRefCollection() {
  return Array.from({ length: 4 }, () => createRef());
}

function createSideRefs() {
  return {
    group: createRef(),
    panel: createRef(),
    bean: createRef(),
    shadow: createRef(),
    fragments: createFragmentRefCollection()
  };
}

export function IntroReveal({ onComplete }) {
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const progressLineRef = useRef(null);
  const progressFillRef = useRef(null);
  const underlayRef = useRef(null);
  const sideRefs = useMemo(
    () => ({
      left: createSideRefs(),
      right: createSideRefs()
    }),
    []
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewportSize = useViewportSize();
  const geometry = getIntroRevealGeometry(viewportSize.width, viewportSize.height);

  useLayoutEffect(() => {
    let cancelled = false;
    const handleTimelineComplete = () => {
      if (!cancelled) {
        onComplete();
      }
    };

    const ctx = gsap.context(() => {
      introRevealTimeline({
        reducedMotion: prefersReducedMotion,
        onComplete: handleTimelineComplete,
        elements: {
          root: rootRef.current,
          logo: logoRef.current,
          progressLine: progressLineRef.current,
          progressFill: progressFillRef.current,
          underlay: underlayRef.current,
          sides: {
            left: {
              group: sideRefs.left.group.current,
              panel: sideRefs.left.panel.current,
              bean: sideRefs.left.bean.current,
              shadow: sideRefs.left.shadow.current,
              fragments: sideRefs.left.fragments.map((fragmentRef) => fragmentRef.current)
            },
            right: {
              group: sideRefs.right.group.current,
              panel: sideRefs.right.panel.current,
              bean: sideRefs.right.bean.current,
              shadow: sideRefs.right.shadow.current,
              fragments: sideRefs.right.fragments.map((fragmentRef) => fragmentRef.current)
            }
          }
        }
      });
    }, rootRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [onComplete, prefersReducedMotion, sideRefs]);

  return (
    <section
      ref={rootRef}
      className="intro-reveal"
      aria-label="Lounge Coffee intro loader"
      data-scene="intro"
    >
      <div className="intro-reveal__stage">
        <div ref={underlayRef} className="intro-reveal__reveal-underlay" aria-hidden="true" />

        <div className="intro-reveal__logo-wrap">
          <div
            ref={logoRef}
            className="intro-reveal__logo"
            aria-hidden="true"
            style={{
              width: `${geometry.logo.width}px`,
              top: `${geometry.logo.top}px`,
              backgroundImage: `url(${assetMap.logos.light})`
            }}
          />
        </div>

        <div className="intro-reveal__split-scene" aria-hidden="true">
          {REVEAL_SIDES.map((side) => {
            const sideGeometry = geometry.sides[side];
            const refs = sideRefs[side];

            return (
              <div
                key={side}
                ref={refs.group}
                className={`intro-reveal__reveal-group intro-reveal__reveal-group--${side}`}
                style={{
                  left: `${sideGeometry.group.left}px`,
                  width: `${sideGeometry.group.width}px`,
                  transformOrigin: sideGeometry.group.transformOrigin
                }}
              >
                <div
                  ref={refs.panel}
                  className={`intro-reveal__panel-surface intro-reveal__panel-surface--${side}`}
                  aria-hidden="true"
                  style={{
                    clipPath: sideGeometry.group.clipPathOpen
                  }}
                />

                <img
                  ref={refs.shadow}
                  className={`intro-reveal__shadow intro-reveal__shadow--${side}`}
                  src={assetMap.shadows.coffeeLeaf}
                  alt=""
                  aria-hidden="true"
                  style={{
                    left: `${sideGeometry.shadow.left}px`,
                    top: `${sideGeometry.shadow.top}px`,
                    width: `${sideGeometry.shadow.width}px`,
                    height: `${sideGeometry.shadow.height}px`
                  }}
                />

                {assetMap.beanFragments[side].map((fragment, index) => (
                  <img
                    key={`${side}-fragment-${index + 1}`}
                    ref={refs.fragments[index]}
                    className={`intro-reveal__fragment intro-reveal__fragment--${side}`}
                    src={fragment}
                    alt=""
                    style={{
                      left: `${sideGeometry.fragments[index].left}px`,
                      top: `${sideGeometry.fragments[index].top}px`,
                      width: `${sideGeometry.fragments[index].width}px`,
                      height: `${sideGeometry.fragments[index].height}px`
                    }}
                  />
                ))}

                <img
                  ref={refs.bean}
                  className={`intro-reveal__group-bean intro-reveal__group-bean--${side}`}
                  src={assetMap.beans.full}
                  alt=""
                  style={{
                    left: `${sideGeometry.bean.left}px`,
                    top: `${sideGeometry.bean.top}px`,
                    width: `${sideGeometry.bean.width}px`,
                    height: `${sideGeometry.bean.height}px`,
                    clipPath: geometry.fractureClip[side]
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          ref={progressLineRef}
          className="intro-reveal__progress"
          style={{
            width: `${geometry.progress.width}px`,
            bottom: `${geometry.progress.bottom}px`
          }}
        >
          <div ref={progressFillRef} className="intro-reveal__progress-fill" />
        </div>
      </div>
    </section>
  );
}
