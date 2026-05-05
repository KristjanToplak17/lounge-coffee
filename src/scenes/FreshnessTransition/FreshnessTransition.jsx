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
    background: [
      "radial-gradient(circle at 12% 18%, rgba(223, 193, 168, 0.18), transparent 20%)",
      "radial-gradient(circle at 50% 56%, rgba(238, 200, 138, 0.18), transparent 24%)",
      "radial-gradient(circle at 92% 32%, rgba(223, 193, 168, 0.16), transparent 20%)",
      "linear-gradient(180deg, rgba(240, 232, 220, 0) 0%, rgba(240, 232, 220, 0.92) 12%, rgba(240, 232, 220, 1) 20%)",
      "var(--color-cream-stage)"
    ].join(", ")
  },
  contentFrame: {
    position: "relative",
    inlineSize: "min(100%, var(--hero-stage-max-width))",
    minBlockSize: "var(--freshness-current-panel-min-height)",
    marginInline: "auto",
    padding: "calc(clamp(90px, 8.8vw, 128px) + 28px) clamp(16px, 2.9vw, 42px) 120px"
  },
  labels: {
    position: "relative",
    zIndex: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem"
  },
  labelBase: {
    margin: 0,
    color: "var(--color-brown-espresso)",
    fontFamily: "\"Haas Grot Disp Trial\", var(--font-display)",
    letterSpacing: "-0.5px"
  },
  labelLeft: {
    fontSize: "clamp(24px, 2.2vw, 28px)",
    fontWeight: 600
  },
  labelRight: {
    maxInlineSize: "clamp(116px, 12vw, 160px)",
    fontSize: "clamp(18px, 1.6vw, 20px)",
    fontWeight: 400,
    lineHeight: 1.15,
    textAlign: "end"
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
    minBlockSize: "clamp(94px, 7.6vw, 110px)",
    gap: "clamp(14px, 1.2vw, 16px)"
  },
  pill: {
    display: "inline-flex",
    inlineSize: "clamp(226px, 19.4vw, 280px)",
    blockSize: "clamp(82px, 6.9vw, 100px)",
    overflow: "hidden",
    borderRadius: "999px",
    boxShadow: "0 16px 34px rgba(53, 21, 18, 0.08), 0 10px 30px rgba(238, 200, 138, 0.14)",
    transform: "translateY(-2px)"
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
    inlineSize: "clamp(96px, 8.2vw, 118px)",
    blockSize: "auto",
    insetInlineEnd: "clamp(126px, 14vw, 202px)",
    insetBlockStart: "clamp(438px, 37vw, 458px)",
    transform: "rotate(-15deg)"
  },
  cupTarget: {
    position: "absolute",
    zIndex: 6,
    insetInlineStart: "50%",
    insetBlockStart: "58%",
    inlineSize: "clamp(410px, 32.6vw, 470px)",
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
    insetBlockEnd: "-9%",
    inlineSize: "46%",
    blockSize: "8.5%",
    borderRadius: "999px",
    background: "radial-gradient(ellipse at center, rgba(53, 21, 18, 0.22) 0%, rgba(53, 21, 18, 0.15) 42%, rgba(53, 21, 18, 0.06) 68%, rgba(53, 21, 18, 0) 100%)",
    filter: "blur(14px)",
    transform: "translateX(-50%)",
    opacity: 0.34
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
          <p
            id={titleId}
            className="freshness-transition__label freshness-transition__label--left"
            style={{ ...sectionStyles.labelBase, ...sectionStyles.labelLeft }}
          >
            Secret Sauce
          </p>
          <p
            className="freshness-transition__label freshness-transition__label--right"
            style={{ ...sectionStyles.labelBase, ...sectionStyles.labelRight }}
          >
            What&apos;s our secret?
          </p>
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
