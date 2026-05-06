import React, { useId, useLayoutEffect, useRef } from "react";
import { createFreshnessTransitionScroll } from "../../animations/freshnessTransitionScroll";
import { assetMap } from "../../utils/assetMap";
import "./FreshnessTransition.css";

const sectionStyles = {
  root: {
    position: "relative",
    minBlockSize: "var(--freshness-current-panel-min-height)",
    overflow: "clip",
    isolation: "isolate",
    background: "transparent"
  },
  contentFrame: {
    position: "relative",
    inlineSize: "min(100%, var(--hero-stage-max-width))",
    minBlockSize: "var(--freshness-current-panel-min-height)",
    marginInline: "auto",
    padding: [
      "calc(clamp(90px, 8vw, 112px) + 28px)",
      "clamp(16px, 2.9vw, 42px)",
      "calc(clamp(90px, 8vw, 112px) + 28px)"
    ].join(" ")
  },
  labels: {
    position: "relative",
    zIndex: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "12px 16px",
    border: "1.5px solid rgba(53, 21, 18, 0.4)",
    borderRadius: "999px",
    background: "rgba(240, 232, 220, 0.74)",
    backdropFilter: "blur(10px)"
  },
  tagText: {
    margin: 0,
    color: "var(--color-brown-espresso)",
    fontFamily: "\"Haas Grot Disp Trial\", var(--font-display)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    lineHeight: 1,
    textAlign: "center",
    textTransform: "uppercase"
  },
  artboard: {
    position: "relative",
    minBlockSize: "clamp(720px, 78vw, 980px)",
    paddingBlockStart: "clamp(156px, 15vw, 176px)"
  },
  statementBase: {
    position: "relative",
    zIndex: 2,
    inlineSize: "min(100%, 1180px)",
    marginInline: "auto",
    color: "var(--color-orange-stage)",
    fontFamily: "\"Haas Grot Disp Trial\", var(--font-display)",
    fontSize: "clamp(74px, 6.4vw, 92px)",
    fontWeight: 700,
    letterSpacing: "var(--freshness-type-letter-spacing)",
    wordSpacing: "0.04em",
    lineHeight: 0.88,
    textTransform: "uppercase"
  },
  lineBase: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minBlockSize: "clamp(90px, 7vw, 100px)",
    gap: "clamp(14px, 1vw, 16px)"
  },
  pill: {
    display: "inline-flex",
    inlineSize: "clamp(226px, 19.4vw, 280px)",
    blockSize: "clamp(82px, 6.9vw, 100px)",
    overflow: "hidden",
    borderRadius: "999px",
    boxShadow: "0 16px 34px rgba(53, 21, 18, 0.08), 0 10px 30px rgba(238, 200, 138, 0.14)",
    transform: "translateY(6px)"
  },
  pillImage: {
    inlineSize: "100%",
    blockSize: "100%",
    objectFit: "cover",
    display: "block"
  },
  sticker: {
    position: "absolute",
    zIndex: 3,
    inlineSize: "clamp(64px, 8.2vw, 80px)",
    blockSize: "auto",
    insetInlineEnd: "clamp(50px, 14vw, 224px)",
    insetBlockStart: "clamp(300px, 37vw, 354px)",
    transform: "rotate(-12deg)"
  },
  cupTarget: {
    position: "absolute",
    zIndex: 6,
    insetInlineStart: "50%",
    insetBlockStart: "35%",
    inlineSize: "clamp(300px, 44vw, 460px)",
    opacity: 0,
    pointerEvents: "none",
    transform: "translate(-50%, -50%)"
  },
  cupBody: {
    position: "relative",
    transformOrigin: "center center"
  },
  cupShadow: {
    position: "absolute",
    insetInlineStart: "50%",
    insetBlockEnd: "-6%",
    inlineSize: "50%",
    blockSize: "10%",
    borderRadius: "999px",
    background: "radial-gradient(ellipse at center, rgba(53, 21, 18, 0.22) 0%, rgba(53, 21, 18, 0.15) 42%, rgba(53, 21, 18, 0.06) 68%, rgba(53, 21, 18, 0) 100%)",
    filter: "blur(16px)",
    transform: "translateX(-50%)",
    opacity: 0.3
  },
  cupImage: {
    position: "relative",
    zIndex: 1,
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    filter: "drop-shadow(var(--hero-cup-shadow))",
    userSelect: "none"
  },
  atmosphereBase: {
    position: "absolute",
    zIndex: 0,
    borderRadius: "999px",
    background: "var(--color-haze)",
    filter: "blur(90px)",
    pointerEvents: "none"
  },
  srOnly: {
    position: "absolute",
    inlineSize: "1px",
    blockSize: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0
  }
};

function InlinePill({ src, alt, className = "" }) {
  return (
    <span className={`freshness-transition__pill ${className}`.trim()} style={sectionStyles.pill}>
      <img className="freshness-transition__pill-image" style={sectionStyles.pillImage} src={src} alt={alt} />
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
      className="freshness-transition"
      aria-labelledby={titleId}
      data-scene="freshness-transition"
      style={sectionStyles.root}
    >
      <div
        className="freshness-transition__atmosphere freshness-transition__atmosphere--left"
        style={{
          ...sectionStyles.atmosphereBase,
          inlineSize: "min(30rem, 30vw)",
          blockSize: "min(18rem, 20vw)",
          insetInlineStart: "-6vw",
          insetBlockStart: "112px",
          opacity: 0.24
        }}
        aria-hidden="true"
      />
      <div
        className="freshness-transition__atmosphere freshness-transition__atmosphere--center"
        style={{
          ...sectionStyles.atmosphereBase,
          inlineSize: "min(34rem, 34vw)",
          blockSize: "min(24rem, 24vw)",
          insetInlineStart: "calc(50% - min(17rem, 17vw))",
          insetBlockStart: "480px",
          background: "rgba(238, 200, 138, 0.72)",
          opacity: 0.22
        }}
        aria-hidden="true"
      />
      <div
        className="freshness-transition__atmosphere freshness-transition__atmosphere--right"
        style={{
          ...sectionStyles.atmosphereBase,
          inlineSize: "min(26rem, 28vw)",
          blockSize: "min(18rem, 20vw)",
          insetInlineEnd: "-4vw",
          insetBlockStart: "196px",
          opacity: 0.18
        }}
        aria-hidden="true"
      />

      <div className="freshness-transition__content-frame" style={sectionStyles.contentFrame}>
        <div className="freshness-transition__labels" style={sectionStyles.labels}>
          <div className="freshness-transition__tag" style={sectionStyles.tag}>
            <TagStarIcon />
            <p id={titleId} className="freshness-transition__tag-text" style={sectionStyles.tagText}>
              Signature Cups. Fresh Bites. Daily Delights.
            </p>
            <TagStarIcon />
          </div>
        </div>

        <div className="freshness-transition__artboard" style={sectionStyles.artboard}>
          <h2 className="freshness-transition__sr-only" style={sectionStyles.srOnly}>
            Crafted with fresh beans and freshly baked delights.
          </h2>

          <div
            className="freshness-transition__statement freshness-transition__statement--desktop"
            style={sectionStyles.statementBase}
            aria-hidden="true"
          >
            <div
              className="freshness-transition__line freshness-transition__line--line1"
              style={sectionStyles.lineBase}
            >
              <span>CRAFTED WITH</span>
              <InlinePill
                className="freshness-transition__pill--coffee"
                src={assetMap.supportingImages.cupOfCoffee}
                alt=""
              />
            </div>
            <div
              className="freshness-transition__line freshness-transition__line--line2"
              style={sectionStyles.lineBase}
            >
              <span>FRESH BEANS AND FRESHLY</span>
            </div>
            <div
              className="freshness-transition__line freshness-transition__line--line3"
              style={sectionStyles.lineBase}
            >
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
            style={{
              ...sectionStyles.statementBase,
              inlineSize: "min(100%, 360px)",
              fontSize: "34px",
              lineHeight: 0.9,
              textAlign: "center"
            }}
            aria-hidden="true"
          >
            <div className="freshness-transition__line freshness-transition__line--mobile-1" style={{ ...sectionStyles.lineBase, justifyContent: "center", minBlockSize: "auto" }}>
              <span>CRAFTED WITH</span>
            </div>
            <div
              className="freshness-transition__line freshness-transition__line--mobile-2"
              style={{ ...sectionStyles.lineBase, justifyContent: "center", minBlockSize: "auto", marginBlockStart: "0.55rem", gap: "0" }}
            >
              <InlinePill src={assetMap.supportingImages.cupOfCoffee} alt="" />
            </div>
            <div
              className="freshness-transition__line freshness-transition__line--mobile-3"
              style={{ ...sectionStyles.lineBase, justifyContent: "center", minBlockSize: "auto", marginBlockStart: "0.55rem" }}
            >
              <span>FRESH BEANS</span>
            </div>
            <div
              className="freshness-transition__line freshness-transition__line--mobile-4"
              style={{ ...sectionStyles.lineBase, justifyContent: "center", minBlockSize: "auto", marginBlockStart: "0.55rem" }}
            >
              <span>AND FRESHLY</span>
            </div>
            <div
              className="freshness-transition__line freshness-transition__line--mobile-5"
              style={{ ...sectionStyles.lineBase, justifyContent: "center", minBlockSize: "auto", marginBlockStart: "0.55rem", gap: "0" }}
            >
              <InlinePill src={assetMap.supportingImages.croissant} alt="" />
            </div>
            <div
              className="freshness-transition__line freshness-transition__line--mobile-6"
              style={{ ...sectionStyles.lineBase, justifyContent: "center", minBlockSize: "auto", marginBlockStart: "0.55rem" }}
            >
              <span>BAKED DELIGHTS</span>
            </div>
          </div>

          <img
            className="freshness-transition__sticker"
            src={assetMap.stickers.coffeePot}
            alt=""
            style={sectionStyles.sticker}
            aria-hidden="true"
          />

          <div ref={settledCupRef} className="freshness-transition__cup-target" style={sectionStyles.cupTarget} aria-hidden="true">
            <div className="freshness-transition__cup-body" style={sectionStyles.cupBody}>
              <div className="freshness-transition__cup-shadow" style={sectionStyles.cupShadow} />
              <img
                className="freshness-transition__cup-image"
                style={sectionStyles.cupImage}
                src={assetMap.cups.black}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
