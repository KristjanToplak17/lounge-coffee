import { gsap } from "gsap";
import { heroRevealMotion } from "../utils/heroRevealMotion";

function isRenderable(element) {
  return element && getComputedStyle(element).display !== "none";
}

function addSharedReveal(timeline, element, fromVars, sharedVars) {
  if (!isRenderable(element)) {
    return;
  }

  timeline.fromTo(
    element,
    {
      ...fromVars,
      willChange: "transform, opacity"
    },
    {
      ...sharedVars,
      clearProps: "willChange"
    },
    0
  );
}

export function heroCompositionTimeline({ elements, reducedMotion = false }) {
  const sharedVars = {
    duration: heroRevealMotion.durationSeconds,
    ease: heroRevealMotion.ease,
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1
  };

  if (reducedMotion) {
    return gsap.timeline({ paused: true });
  }

  const timeline = gsap.timeline({ paused: true });

  addSharedReveal(timeline, elements.chrome, { y: -24, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.redCup, { y: -32, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.stats, { x: 28, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.copy, { y: 28, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.sticker, { y: 28, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.yellowCup, { x: -32, rotation: 6, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.blackCup, { x: -32, rotation: 6, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.orangeCup, { x: -32, rotation: 6, opacity: 0 }, sharedVars);

  return timeline;
}
