import React, { createRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { introRevealTimeline } from "../../animations/introRevealTimeline";
import { assetMap } from "../../utils/assetMap";
import { getIntroRevealGeometry } from "../../utils/motionConfig";
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

export function IntroReveal({ onComplete }) {
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const progressLineRef = useRef(null);
  const progressFillRef = useRef(null);
  const underlayRef = useRef(null);
  const leftShadowRef = useRef(null);
  const rightShadowRef = useRef(null);
  const leftGroupRef = useRef(null);
  const rightGroupRef = useRef(null);
  const leftFragmentRefs = useMemo(() => createFragmentRefCollection(), []);
  const rightFragmentRefs = useMemo(() => createFragmentRefCollection(), []);
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
          leftShadow: leftShadowRef.current,
          rightShadow: rightShadowRef.current,
          leftGroup: leftGroupRef.current,
          rightGroup: rightGroupRef.current,
          leftFragments: leftFragmentRefs.map((fragmentRef) => fragmentRef.current),
          rightFragments: rightFragmentRefs.map((fragmentRef) => fragmentRef.current)
        }
      });
    }, rootRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [leftFragmentRefs, onComplete, prefersReducedMotion, rightFragmentRefs]);

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
          <div
            ref={leftGroupRef}
            className="intro-reveal__reveal-group intro-reveal__reveal-group--left"
            style={{
              left: `${geometry.leftGroup.left}px`,
              width: `${geometry.leftGroup.width}px`,
              transformOrigin: geometry.leftGroup.transformOrigin
            }}
          >
            <img
              className="intro-reveal__panel-image"
              src={assetMap.revealPanels.left}
              alt=""
              style={{
                left: `${geometry.leftPanel.left}px`,
                width: `${geometry.leftPanel.width}px`,
                height: `${geometry.leftPanel.height}px`
              }}
            />
            <img
              ref={leftShadowRef}
              className="intro-reveal__shadow intro-reveal__shadow--left"
              src={assetMap.shadows.coffeeLeaf}
              alt=""
              aria-hidden="true"
              style={{
                left: `${geometry.leftShadow.left}px`,
                top: `${geometry.leftShadow.top}px`,
                width: `${geometry.leftShadow.width}px`,
                height: `${geometry.leftShadow.height}px`
              }}
            />
            {assetMap.beanFragments.left.map((fragment, index) => (
              <img
                key={`left-fragment-${index + 1}`}
                ref={leftFragmentRefs[index]}
                className="intro-reveal__fragment intro-reveal__fragment--left"
                src={fragment}
                alt=""
                style={{
                  left: `${geometry.fragments.left[index].left}px`,
                  top: `${geometry.fragments.left[index].top}px`,
                  width: `${geometry.fragments.left[index].width}px`,
                  height: `${geometry.fragments.left[index].height}px`
                }}
              />
            ))}
            <img
              className="intro-reveal__group-bean intro-reveal__group-bean--left"
              src={assetMap.beans.left}
              alt=""
              style={{
                left: `${geometry.leftBean.left}px`,
                top: `${geometry.leftBean.top}px`,
                width: `${geometry.leftBean.width}px`,
                height: `${geometry.leftBean.height}px`
              }}
            />
          </div>

          <div
            ref={rightGroupRef}
            className="intro-reveal__reveal-group intro-reveal__reveal-group--right"
            style={{
              left: `${geometry.rightGroup.left}px`,
              width: `${geometry.rightGroup.width}px`,
              transformOrigin: geometry.rightGroup.transformOrigin
            }}
          >
            <img
              className="intro-reveal__panel-image"
              src={assetMap.revealPanels.right}
              alt=""
              style={{
                left: `${geometry.rightPanel.left}px`,
                width: `${geometry.rightPanel.width}px`,
                height: `${geometry.rightPanel.height}px`
              }}
            />
            <img
              ref={rightShadowRef}
              className="intro-reveal__shadow intro-reveal__shadow--right"
              src={assetMap.shadows.coffeeLeaf}
              alt=""
              aria-hidden="true"
              style={{
                left: `${geometry.rightShadow.left}px`,
                top: `${geometry.rightShadow.top}px`,
                width: `${geometry.rightShadow.width}px`,
                height: `${geometry.rightShadow.height}px`
              }}
            />
            {assetMap.beanFragments.right.map((fragment, index) => (
              <img
                key={`right-fragment-${index + 1}`}
                ref={rightFragmentRefs[index]}
                className="intro-reveal__fragment intro-reveal__fragment--right"
                src={fragment}
                alt=""
                style={{
                  left: `${geometry.fragments.right[index].left}px`,
                  top: `${geometry.fragments.right[index].top}px`,
                  width: `${geometry.fragments.right[index].width}px`,
                  height: `${geometry.fragments.right[index].height}px`
                }}
              />
            ))}
            <img
              className="intro-reveal__group-bean intro-reveal__group-bean--right"
              src={assetMap.beans.right}
              alt=""
              style={{
                left: `${geometry.rightBean.left}px`,
                top: `${geometry.rightBean.top}px`,
                width: `${geometry.rightBean.width}px`,
                height: `${geometry.rightBean.height}px`
              }}
            />
          </div>
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
