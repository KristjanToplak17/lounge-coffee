import { gsap } from "gsap";
import {
  getIntroDebugState,
  getLoaderViewportTier,
  motionConfig,
  REVEAL_SIDES
} from "../utils/motionConfig";

function applyGroupPose(pose, { includeOpacity = true } = {}) {
  const result = {
    x: pose.xViewport ? window.innerWidth * pose.xViewport : pose.x || 0,
    xPercent: pose.xPercent || 0,
    yPercent: pose.yPercent,
    scale: pose.scale
  };

  if (includeOpacity && pose.opacity !== undefined) {
    result.opacity = pose.opacity;
  }

  return result;
}

function applyShadowPose(pose) {
  return {
    xPercent: pose.xPercent,
    yPercent: pose.yPercent,
    scale: pose.scale,
    opacity: pose.opacity
  };
}

function getCurrentFragmentStates(fragmentStates, tier) {
  if (fragmentStates[tier]) {
    return fragmentStates[tier];
  }

  return fragmentStates.desktop;
}

function setMotionState(root, state) {
  if (root) {
    root.dataset.motionState = state;
  }
}

function setFragments(elements, states) {
  elements.forEach((element, index) => {
    const state = states[index];

    if (!element || !state) {
      return;
    }

    gsap.set(element, {
      x: state.x,
      y: state.y,
      rotation: state.rotation,
      scale: state.scale,
      opacity: state.opacity,
      filter: "drop-shadow(0 8px 18px rgba(53, 21, 18, 0.18))"
    });
  });
}

function tweenFragments(timeline, elements, states, duration, ease, position) {
  elements.forEach((element, index) => {
    const state = states[index];

    if (!element || !state) {
      return;
    }

    timeline.to(
      element,
      {
        duration,
        x: state.x,
        y: state.y,
        rotation: state.rotation,
        scale: state.scale,
        opacity: state.opacity,
        ease
      },
      position
    );
  });
}

function setDebugState({ debugState, elements, groups, shadows, fragments }) {
  const groupState = groups[debugState];
  const shadowState = shadows[debugState];

  gsap.set(elements.progressFill, {
    scaleX: debugState === "start" ? 0 : 1,
    transformOrigin: "0% 50%"
  });
  gsap.set(elements.progressLine, { opacity: debugState === "start" ? 1 : 0 });
  gsap.set(elements.logo, { opacity: debugState === "start" ? 1 : 0 });
  gsap.set(elements.underlay, { opacity: 0, clipPath: "none" });

  REVEAL_SIDES.forEach((side) => {
    const sideElements = elements.sides[side];

    gsap.set(sideElements.group, {
      ...applyGroupPose(groupState[side], { includeOpacity: false }),
      opacity: 1
    });
    gsap.set(sideElements.panel, { opacity: 1 });
    gsap.set(sideElements.bean, { opacity: 1 });
    gsap.set(sideElements.shadow, applyShadowPose(shadowState[side]));
    setFragments(
      sideElements.fragments,
      debugState === "start"
        ? fragments.start
        : debugState === "mid"
          ? fragments.hold[side]
          : fragments.end[side]
    );
  });

  setMotionState(elements.root, debugState);
}

function createReducedMotionTimeline({ elements, onComplete, reducedMotionConfig }) {
  const timeline = gsap.timeline({ onComplete });

  timeline.to({}, { duration: 0.28 });

  timeline.to(elements.progressFill, {
    duration: 0.64,
    scaleX: 1,
    ease: "none"
  });

  timeline.to({}, { duration: 0.18 });

  timeline.to(
    [elements.progressLine, elements.logo],
    {
      duration: 0.22,
      opacity: 0,
      ease: "power1.out"
    }
  );

  REVEAL_SIDES.forEach((side, index) => {
    timeline.to(
      elements.sides[side].group,
      {
        duration: 0.72,
        xPercent: reducedMotionConfig[side].xPercent,
        yPercent: 0,
        scale: reducedMotionConfig[side].scale,
        opacity: reducedMotionConfig[side].opacity,
        ease: "cubic-bezier(0.23, 1, 0.32, 1)"
      },
      index === 0 ? ">" : "<"
    );
  });

  REVEAL_SIDES.forEach((side, index) => {
    timeline.to(
      elements.sides[side].shadow,
      {
        duration: 0.46,
        opacity: 0.04,
        ease: "power1.out"
      },
      index === 0 ? "<" : "<"
    );
  });

  timeline.call(() => setMotionState(elements.root, "end"));

  return timeline;
}

export function introRevealTimeline({ elements, reducedMotion = false, onComplete }) {
  const loaderConfig = motionConfig.loader;
  const tier = getLoaderViewportTier(window.innerWidth);
  const timings = loaderConfig.timingsMs;
  const groups = loaderConfig.groups[tier];
  const shadows = loaderConfig.shadows;
  const fragmentStates = getCurrentFragmentStates(loaderConfig.fragments, tier);
  const debugState = getIntroDebugState();

  gsap.set(elements.root, { opacity: 1 });
  gsap.set(elements.logo, { opacity: 1 });
  gsap.set(elements.progressLine, { opacity: 1 });
  gsap.set(elements.underlay, {
    opacity: 0,
    clipPath: "none"
  });
  gsap.set(elements.progressFill, {
    scaleX: 0,
    transformOrigin: "0% 50%"
  });

  REVEAL_SIDES.forEach((side) => {
    const sideElements = elements.sides[side];

    gsap.set(sideElements.group, {
      ...applyGroupPose(groups.start[side], { includeOpacity: false }),
      opacity: 1,
      transformOrigin: sideElements.group.style.transformOrigin || (side === "left" ? "100% 50%" : "0% 50%")
    });
    gsap.set(sideElements.panel, { opacity: 1 });
    gsap.set(sideElements.bean, { opacity: 1 });
    gsap.set(sideElements.shadow, applyShadowPose(shadows.start[side]));
    setFragments(sideElements.fragments, fragmentStates.start);
  });

  setMotionState(elements.root, "start");

  if (debugState) {
    setDebugState({
      debugState,
      elements,
      groups,
      shadows,
      fragments: fragmentStates
    });

    return gsap.timeline({ paused: true });
  }

  if (reducedMotion) {
    return createReducedMotionTimeline({
      elements,
      onComplete,
      reducedMotionConfig: loaderConfig.reducedMotion
    });
  }

  const timeline = gsap.timeline({ onComplete });
  const startToMidSeconds = timings.startToMid / 1000;
  const midHoldSeconds = timings.midHold / 1000;
  const midToEndSeconds = timings.midToEnd / 1000;
  const fragmentReleaseSeconds = startToMidSeconds * 0.3;
  const fragmentMidSeconds = startToMidSeconds * 0.5;

  timeline.to({}, { duration: timings.initialHold / 1000 });

  timeline.to(elements.progressFill, {
    duration: timings.loaderFill / 1000,
    scaleX: 1,
    ease: "none"
  });

  timeline.to({}, { duration: timings.loaderCompleteHold / 1000 });

  timeline.to(
    [elements.progressLine, elements.logo],
    {
      duration: timings.loaderFade / 1000,
      opacity: 0,
      ease: loaderConfig.easing.loaderFade
    }
  );

  timeline.addLabel("startToMid");

  REVEAL_SIDES.forEach((side, index) => {
    timeline.to(
      elements.sides[side].group,
      {
        duration: startToMidSeconds,
        ...applyGroupPose(groups.mid[side], { includeOpacity: false }),
        ease: loaderConfig.easing.startToMid
      },
      index === 0 ? "startToMid" : "startToMid"
    );
  });

  REVEAL_SIDES.forEach((side, index) => {
    timeline.to(
      elements.sides[side].shadow,
      {
        duration: startToMidSeconds * 0.92,
        ...applyShadowPose(shadows.mid[side]),
        ease: loaderConfig.easing.startToMid
      },
      index === 0 ? "startToMid+=0.02" : "startToMid+=0.02"
    );
  });

  REVEAL_SIDES.forEach((side) => {
    tweenFragments(
      timeline,
      elements.sides[side].fragments,
      fragmentStates.release[side],
      fragmentReleaseSeconds,
      loaderConfig.easing.startToMid,
      "startToMid+=0.08"
    );

    tweenFragments(
      timeline,
      elements.sides[side].fragments,
      fragmentStates.mid[side],
      fragmentMidSeconds,
      loaderConfig.easing.startToMid,
      `startToMid+=${Math.min(0.32, startToMidSeconds * 0.2)}`
    );
  });

  timeline.call(
    () => setMotionState(elements.root, "mid"),
    null,
    `startToMid+=${Math.max(0.01, startToMidSeconds - 0.04)}`
  );

  timeline.addLabel("midHold");

  REVEAL_SIDES.forEach((side) => {
    tweenFragments(
      timeline,
      elements.sides[side].fragments,
      fragmentStates.hold[side],
      midHoldSeconds,
      "linear",
      "midHold"
    );
  });

  timeline.to({}, { duration: midHoldSeconds }, "midHold");

  timeline.addLabel("midToEnd");

  REVEAL_SIDES.forEach((side) => {
    timeline.to(
      elements.sides[side].group,
      {
        duration: midToEndSeconds,
        ...applyGroupPose(groups.end[side], { includeOpacity: false }),
        ease: loaderConfig.easing.midToEnd
      },
      "midToEnd"
    );
  });

  REVEAL_SIDES.forEach((side) => {
    timeline.to(
      elements.sides[side].shadow,
      {
        duration: midToEndSeconds,
        ...applyShadowPose(shadows.end[side]),
        ease: loaderConfig.easing.midToEnd
      },
      "midToEnd"
    );
  });

  REVEAL_SIDES.forEach((side) => {
    tweenFragments(
      timeline,
      elements.sides[side].fragments,
      fragmentStates.end[side],
      midToEndSeconds,
      loaderConfig.easing.midToEnd,
      "midToEnd"
    );
  });

  timeline.call(
    () => setMotionState(elements.root, "end"),
    null,
    `midToEnd+=${Math.max(0.01, midToEndSeconds - 0.02)}`
  );

  return timeline;
}
