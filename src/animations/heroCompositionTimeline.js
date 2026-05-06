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

function addShadowReveal(timeline, element, startAtSeconds) {
  if (!isRenderable(element)) {
    return;
  }

  const targetOpacity = Number.parseFloat(getComputedStyle(element).opacity) || 1;

  timeline.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.7,
      willChange: "transform, opacity"
    },
    {
      duration: 0.5,
      ease: heroRevealMotion.ease,
      opacity: targetOpacity,
      scale: 1,
      clearProps: "willChange"
    },
    startAtSeconds
  );
}

export function heroCompositionTimeline({
  elements,
  reducedMotion = false,
  onComplete
}) {
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

  const timeline = gsap.timeline({
    paused: true,
    onComplete
  });
  const shadowRevealStart = Math.max(heroRevealMotion.durationSeconds - 0.75, 0);

  addSharedReveal(timeline, elements.chrome, { y: -48, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.redCup, { y: -40, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.stats, { x: 36, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.copy, { y: 36, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.sticker, { y: 36, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.yellowCup, { x: -40, rotation: 8, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.blackCup, { x: -40, rotation: 8, opacity: 0 }, sharedVars);
  addSharedReveal(timeline, elements.orangeCup, { x: -40, rotation: 8, opacity: 0 }, sharedVars);
  addShadowReveal(timeline, elements.redCupShadow, shadowRevealStart);
  addShadowReveal(timeline, elements.yellowCupShadow, shadowRevealStart);
  addShadowReveal(timeline, elements.blackCupShadow, shadowRevealStart);
  addShadowReveal(timeline, elements.orangeCupShadow, shadowRevealStart);

  return timeline;
}
