import { gsap } from "gsap";
import {
  getIntroDebugState,
  getLoaderViewportTier,
  motionConfig
} from "../utils/motionConfig";

function applyGroupPose(pose) {
  return {
    x: pose.xViewport ? window.innerWidth * pose.xViewport : pose.x || 0,
    xPercent: pose.xPercent || 0,
    yPercent: pose.yPercent,
    scale: pose.scale,
    opacity: pose.opacity
  };
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
      filter: state.blur
        ? `blur(${state.blur}px) drop-shadow(0 8px 18px rgba(53, 21, 18, 0.18))`
        : "drop-shadow(0 8px 18px rgba(53, 21, 18, 0.18))"
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
  const isStart = debugState === "start";
  const groupState = groups[debugState];
  const shadowState = shadows[debugState];

  gsap.set(elements.progressFill, {
    scaleX: isStart ? 0 : 1,
    transformOrigin: "0% 50%"
  });
  gsap.set(elements.progressLine, { opacity: isStart ? 1 : 0 });
  gsap.set(elements.logo, { opacity: isStart ? 1 : 0 });
  gsap.set(elements.underlay, { opacity: isStart ? 0 : 1 });
  gsap.set(elements.leftGroup, applyGroupPose(groupState.left));
  gsap.set(elements.rightGroup, applyGroupPose(groupState.right));
  gsap.set(elements.leftShadow, applyShadowPose(shadowState.left));
  gsap.set(elements.rightShadow, applyShadowPose(shadowState.right));

  setFragments(
    elements.leftFragments,
    debugState === "start"
      ? fragments.start
      : debugState === "mid"
        ? fragments.holdLeft
        : fragments.endLeft
  );
  setFragments(
    elements.rightFragments,
    debugState === "start"
      ? fragments.start
      : debugState === "mid"
        ? fragments.holdRight
        : fragments.endRight
  );
  setMotionState(elements.root, debugState);
}

function createReducedMotionTimeline({ elements, onComplete, reducedMotionConfig }) {
  const timeline = gsap.timeline({ onComplete });

  timeline.to({}, { duration: 0.22 });

  timeline.to(elements.progressFill, {
    duration: 0.56,
    scaleX: 1,
    ease: "none"
  });

  timeline.to({}, { duration: 0.18 });

  timeline.to(
    [elements.progressLine, elements.logo],
    {
      duration: 0.24,
      opacity: 0,
      ease: "power1.out"
    }
  );

  timeline.to(
    elements.underlay,
    {
      duration: 0.42,
      opacity: 1,
      ease: "power1.out"
    },
    ">"
  );

  timeline.to(
    [elements.leftShadow, elements.rightShadow],
    {
      duration: 0.34,
      opacity: 0.06,
      ease: "power1.out"
    },
    "<"
  );

  timeline.to(
    elements.leftGroup,
    {
      duration: 0.6,
      xPercent: reducedMotionConfig.left.xPercent,
      yPercent: -0.5,
      scale: reducedMotionConfig.left.scale,
      opacity: reducedMotionConfig.left.opacity,
      ease: "cubic-bezier(0.5, 0, 0.2, 1)"
    },
    ">"
  );

  timeline.to(
    elements.rightGroup,
    {
      duration: 0.6,
      xPercent: reducedMotionConfig.right.xPercent,
      yPercent: -0.5,
      scale: reducedMotionConfig.right.scale,
      opacity: reducedMotionConfig.right.opacity,
      ease: "cubic-bezier(0.5, 0, 0.2, 1)"
    },
    "<"
  );

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
  gsap.set(elements.underlay, { opacity: 0 });
  gsap.set(elements.progressFill, {
    scaleX: 0,
    transformOrigin: "0% 50%"
  });
  gsap.set(elements.leftGroup, {
    ...applyGroupPose(groups.start.left),
    transformOrigin: elements.leftGroup.style.transformOrigin || "100% 50%"
  });
  gsap.set(elements.rightGroup, {
    ...applyGroupPose(groups.start.right),
    transformOrigin: elements.rightGroup.style.transformOrigin || "0% 50%"
  });
  gsap.set(elements.leftShadow, applyShadowPose(shadows.start.left));
  gsap.set(elements.rightShadow, applyShadowPose(shadows.start.right));
  setFragments(elements.leftFragments, fragmentStates.start);
  setFragments(elements.rightFragments, fragmentStates.start);
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

  timeline.to({}, { duration: timings.initialHold / 1000 });

  timeline.to(elements.progressFill, {
    duration: timings.loaderFill / 1000,
    scaleX: 1,
    ease: "none"
  });

  timeline.to({}, { duration: timings.loaderCompleteHold / 1000 });

  timeline.to(elements.progressLine, {
    duration: timings.loaderFade / 1000,
    opacity: 0,
    ease: loaderConfig.easing.loaderFade
  });

  timeline.addLabel("startToMid");

  timeline.to(
    elements.underlay,
    {
      duration: Math.min(0.48, (timings.startToMid / 1000) * 0.28),
      opacity: 1,
      ease: loaderConfig.easing.loaderFade
    },
    "startToMid+=0.3"
  );

  timeline.to(
    elements.logo,
    {
      duration: Math.min(0.98, (timings.startToMid / 1000) * 0.48),
      opacity: 0,
      ease: loaderConfig.easing.loaderFade
    },
    "startToMid"
  );

  timeline.to(
    elements.leftGroup,
    {
      duration: timings.startToMid / 1000,
      ...applyGroupPose(groups.mid.left),
      ease: loaderConfig.easing.startToMid
    },
    "startToMid"
  );

  timeline.to(
    elements.rightGroup,
    {
      duration: timings.startToMid / 1000,
      ...applyGroupPose(groups.mid.right),
      ease: loaderConfig.easing.startToMid
    },
    "startToMid"
  );

  timeline.to(
    elements.leftShadow,
    {
      duration: (timings.startToMid / 1000) * 0.92,
      ...applyShadowPose(shadows.mid.left),
      ease: loaderConfig.easing.startToMid
    },
    "startToMid+=0.08"
  );

  timeline.to(
    elements.rightShadow,
    {
      duration: (timings.startToMid / 1000) * 0.92,
      ...applyShadowPose(shadows.mid.right),
      ease: loaderConfig.easing.startToMid
    },
    "startToMid+=0.08"
  );

  tweenFragments(
    timeline,
    elements.leftFragments,
    fragmentStates.midLeft,
    (timings.startToMid / 1000) * 0.24,
    "power3.out",
    "startToMid+=0.06"
  );

  tweenFragments(
    timeline,
    elements.rightFragments,
    fragmentStates.midRight,
    (timings.startToMid / 1000) * 0.24,
    "power3.out",
    "startToMid+=0.06"
  );

  timeline.call(
    () => setMotionState(elements.root, "mid"),
    null,
    `startToMid+=${Math.max(0.01, timings.startToMid / 1000 - 0.04)}`
  );

  timeline.addLabel("midHold");

  tweenFragments(
    timeline,
    elements.leftFragments,
    fragmentStates.holdLeft,
    timings.midHold / 1000,
    "linear",
    "midHold"
  );

  tweenFragments(
    timeline,
    elements.rightFragments,
    fragmentStates.holdRight,
    timings.midHold / 1000,
    "linear",
    "midHold"
  );

  timeline.to({}, { duration: timings.midHold / 1000 }, "midHold");

  timeline.addLabel("midToEnd");

  timeline.to(
    elements.leftGroup,
    {
      duration: (timings.midToEnd / 1000) * 0.84,
      ...applyGroupPose(groups.end.left),
      ease: loaderConfig.easing.midToEnd
    },
    "midToEnd+=0.02"
  );

  timeline.to(
    elements.rightGroup,
    {
      duration: (timings.midToEnd / 1000) * 0.84,
      ...applyGroupPose(groups.end.right),
      ease: loaderConfig.easing.midToEnd
    },
    "midToEnd+=0.02"
  );

  timeline.to(
    elements.leftShadow,
    {
      duration: timings.midToEnd / 1000,
      ...applyShadowPose(shadows.end.left),
      ease: loaderConfig.easing.midToEnd
    },
    "midToEnd"
  );

  timeline.to(
    elements.rightShadow,
    {
      duration: timings.midToEnd / 1000,
      ...applyShadowPose(shadows.end.right),
      ease: loaderConfig.easing.midToEnd
    },
    "midToEnd"
  );

  tweenFragments(
    timeline,
    elements.leftFragments,
    fragmentStates.endLeft,
    timings.midToEnd / 1000,
    loaderConfig.easing.midToEnd,
    "midToEnd"
  );

  tweenFragments(
    timeline,
    elements.rightFragments,
    fragmentStates.endRight,
    timings.midToEnd / 1000,
    loaderConfig.easing.midToEnd,
    "midToEnd"
  );

  timeline.call(
    () => setMotionState(elements.root, "end"),
    null,
    `midToEnd+=${Math.max(0.01, timings.midToEnd / 1000 - 0.02)}`
  );

  return timeline;
}
