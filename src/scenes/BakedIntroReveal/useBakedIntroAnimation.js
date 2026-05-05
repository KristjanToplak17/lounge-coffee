import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import {
  END_SCALE,
  EASE,
  FRAGMENTS,
  LOADER_TIMING,
  MID_SCALE,
  REDUCED_TIMING,
  getScaledFragmentMotion,
  setFragmentState
} from "./bakedIntroShared";

export function useBakedIntroAnimation({
  refs,
  geometry,
  sceneState,
  prefersReducedMotion = false,
  onComplete,
  onHeroRevealStart,
  fadeBackdropOnExit = false
}) {
  useLayoutEffect(() => {
    const {
      rootRef,
      backdropRef,
      logoRef,
      progressRef,
      progressFillRef,
      heroRevealStartedRef,
      leftPanelGroupRef,
      rightPanelGroupRef,
      leftContentGroupRef,
      rightContentGroupRef,
      leftSeamCapRef,
      rightSeamCapRef,
      rightShadowRef,
      leftFragmentRefs,
      rightFragmentRefs
    } = refs;

    const leftPanelGroup = leftPanelGroupRef.current;
    const rightPanelGroup = rightPanelGroupRef.current;
    const leftContentGroup = leftContentGroupRef.current;
    const rightContentGroup = rightContentGroupRef.current;
    const leftSeamCap = leftSeamCapRef.current;
    const rightSeamCap = rightSeamCapRef.current;
    const rightShadow = rightShadowRef.current;
    const logo = logoRef.current;
    const progress = progressRef.current;
    const progressFill = progressFillRef.current;
    const backdrop = backdropRef.current;
    const leftFragments = leftFragmentRefs.current;
    const rightFragments = rightFragmentRefs.current;

    if (
      !leftPanelGroup ||
      !rightPanelGroup ||
      !leftContentGroup ||
      !rightContentGroup ||
      !leftSeamCap ||
      !rightSeamCap ||
      !rightShadow ||
      !logo ||
      !progress ||
      !progressFill
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

      const killTargets = [
        logo,
        progress,
        progressFill,
        ...leftTargets,
        ...rightTargets,
        leftSeamCap,
        rightSeamCap,
        rightShadow,
        ...leftFragments,
        ...rightFragments
      ];

      if (backdrop) {
        killTargets.push(backdrop);
      }

      gsap.killTweensOf(killTargets);

      gsap.set(progressFill, { scaleX: 0 });
      gsap.set(progress, { opacity: 1 });
      gsap.set(logo, { opacity: 0.96, y: 0 });
      gsap.set(leftTargets, { x: 0, scale: 1, transformOrigin: "100% 50%" });
      gsap.set(rightTargets, { x: 0, scale: 1, transformOrigin: "0% 50%" });
      gsap.set(leftSeamCap, { opacity: 1 });
      gsap.set(rightSeamCap, { opacity: 1 });
      gsap.set(rightShadow, { opacity: geometry.shadows.right.opacity, x: 0, y: 0, scale: 1 });

      if (backdrop) {
        gsap.set(backdrop, { opacity: 1 });
      }

      allFragments.forEach(({ elements, geometry: fragmentGeometry }) => {
        setFragmentState(elements, fragmentGeometry, geometry.artScale, "start");
      });

      if (sceneState === "start") {
        return;
      }

      if (sceneState === "mid") {
        gsap.set(progressFill, { scaleX: 1 });
        gsap.set(progress, { opacity: 0 });
        gsap.set(logo, { opacity: 0, y: -10 * geometry.artScale });
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

        if (backdrop) {
          gsap.set(backdrop, { opacity: 1 });
        }

        allFragments.forEach(({ elements, geometry: fragmentGeometry }) => {
          setFragmentState(elements, fragmentGeometry, geometry.artScale, "mid");
        });
        return;
      }

      if (sceneState === "end") {
        gsap.set(progressFill, { scaleX: 1 });
        gsap.set(progress, { opacity: 0 });
        gsap.set(logo, { opacity: 0, y: -12 * geometry.artScale });
        gsap.set(leftSeamCap, { opacity: 0 });
        gsap.set(rightSeamCap, { opacity: 0 });

        if (backdrop) {
          gsap.set(backdrop, { opacity: fadeBackdropOnExit ? 0 : 1 });
        }

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

      timeline.to(progressFill, {
        duration: timing.loaderFill,
        scaleX: 1,
        ease: "none"
      }, timing.initialHold);
      timeline.to(progress, {
        duration: timing.loaderFade,
        opacity: 0,
        ease: EASE.loaderFade
      }, timing.initialHold + timing.loaderFill + timing.loaderCompleteHold);
      timeline.to(logo, {
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

      if (onHeroRevealStart) {
        timeline.call(triggerHeroReveal, null, "midToEnd");
      }

      if (backdrop && fadeBackdropOnExit) {
        timeline.to(backdrop, {
          duration: timing.midToEnd,
          opacity: 0,
          ease: EASE.midToEnd
        }, "midToEnd");
      }

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
  }, [fadeBackdropOnExit, geometry, onComplete, onHeroRevealStart, prefersReducedMotion, refs, sceneState]);
}
