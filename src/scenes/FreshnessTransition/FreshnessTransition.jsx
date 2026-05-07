import React, { useId, useLayoutEffect, useRef } from "react";
import { createFreshnessTransitionScroll } from "../../animations/freshnessTransitionScroll";
import { assetMap } from "../../utils/assetMap";
import "./FreshnessTransition.css";

function InlinePill({ src, alt, className = "" }) {
  return (
    <span className={`freshness-transition__pill ${className}`.trim()}>
      <img className="freshness-transition__pill-image" src={src} alt={alt} />
    </span>
  );
}

function TagStarIcon() {
  return (
    <svg
      className="freshness-transition__tag-star"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M8 0.5l1.66 5.84L15.5 8l-5.84 1.66L8 15.5l-1.66-5.84L0.5 8l5.84-1.66L8 0.5z"
      />
    </svg>
  );
}

export function FreshnessTransition({
  heroRevealRef,
  introComplete = false,
  reducedMotion = false,
  overlayHostRef,
  overlayCupRef
}) {
  const titleId = useId();
  const rootRef = useRef(null);
  const settledCupRef = useRef(null);

  useLayoutEffect(() => {
    return createFreshnessTransitionScroll({
      heroController: heroRevealRef.current,
      introComplete,
      reducedMotion,
      elements: {
        root: rootRef.current,
        settledCup: settledCupRef.current,
        overlayHost: overlayHostRef.current,
        overlayCup: overlayCupRef.current
      }
    });
  }, [heroRevealRef, introComplete, overlayCupRef, overlayHostRef, reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="freshness-transition bordered-section"
      aria-labelledby={titleId}
      data-scene="freshness-transition"
    >
      <div className="bordered-section__divider bordered-section__divider--top" aria-hidden="true" />

      <div className="freshness-transition__atmosphere freshness-transition__atmosphere--left" aria-hidden="true" />
      <div className="freshness-transition__atmosphere freshness-transition__atmosphere--center" aria-hidden="true" />
      <div className="freshness-transition__atmosphere freshness-transition__atmosphere--right" aria-hidden="true" />

      <div className="freshness-transition__content-frame">
        <div className="freshness-transition__labels">
          <div className="freshness-transition__tag">
            <TagStarIcon />
            <p id={titleId} className="freshness-transition__tag-text">
              Signature Cups. Fresh Bites. Daily Delights.
            </p>
            <TagStarIcon />
          </div>
        </div>

        <div className="freshness-transition__artboard">
          <h2 className="freshness-transition__sr-only">
            Crafted with fresh beans and freshly baked delights.
          </h2>

          <div
            className="freshness-transition__statement freshness-transition__statement--desktop"
            aria-hidden="true"
          >
            <div className="freshness-transition__line freshness-transition__line--line1">
              <span>CRAFTED WITH</span>
              <InlinePill
                className="freshness-transition__pill--coffee"
                src={assetMap.supportingImages.cupOfCoffee}
                alt=""
              />
            </div>
            <div className="freshness-transition__line freshness-transition__line--line2">
              <span>FRESH BEANS AND FRESHLY</span>
            </div>
            <div className="freshness-transition__line freshness-transition__line--line3">
              <InlinePill
                className="freshness-transition__pill--croissant"
                src={assetMap.supportingImages.croissant}
                alt=""
              />
              <span>BAKED DELIGHTS</span>
            </div>
          </div>

          <div
            className="freshness-transition__statement freshness-transition__statement--mobile"
            aria-hidden="true"
          >
            <div className="freshness-transition__line freshness-transition__line--mobile-1">
              <span>CRAFTED WITH</span>
            </div>
            <div className="freshness-transition__line freshness-transition__line--mobile-2">
              <InlinePill src={assetMap.supportingImages.cupOfCoffee} alt="" />
            </div>
            <div className="freshness-transition__line freshness-transition__line--mobile-3">
              <span>FRESH BEANS</span>
            </div>
            <div className="freshness-transition__line freshness-transition__line--mobile-4">
              <span>AND FRESHLY</span>
            </div>
            <div className="freshness-transition__line freshness-transition__line--mobile-5">
              <InlinePill src={assetMap.supportingImages.croissant} alt="" />
            </div>
            <div className="freshness-transition__line freshness-transition__line--mobile-6">
              <span>BAKED DELIGHTS</span>
            </div>
          </div>

          <img
            className="freshness-transition__sticker"
            src={assetMap.stickers.coffeePot}
            alt=""
            aria-hidden="true"
          />

          <div ref={settledCupRef} className="freshness-transition__cup-target" aria-hidden="true">
            <div className="freshness-transition__cup-body">
              <div className="freshness-transition__cup-shadow" />
              <img
                className="freshness-transition__cup-image"
                src={assetMap.cups.black}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bordered-section__divider bordered-section__divider--bottom" aria-hidden="true" />
    </section>
  );
}
