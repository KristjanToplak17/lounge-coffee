import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  buildCupTransitionMetrics,
  getHeroCupVisible,
  getSettledCupOpacity,
  getTransitionCupOpacity,
  lerp,
  measureElementRect
} from "../utils/freshnessTransitionGeometry";

gsap.registerPlugin(ScrollTrigger);

export function createFreshnessTransitionScroll({
  heroController,
  introComplete,
  reducedMotion = false,
  elements
}) {
  const {
    root,
    settledCup,
    overlayHost,
    overlayCup
  } = elements;

  if (!root || !settledCup || !overlayHost || !overlayCup || !heroController) {
    return () => {};
  }

  const prefersStatic = reducedMotion || !introComplete;

  const ctx = gsap.context(() => {
    const state = {
      sourceRect: null
    };
    const overlayCupBody = overlayCup.firstElementChild;
    const settledCupBody = settledCup.firstElementChild;
    const finalRotation = -9;
    const sourceRotation = 0;

    const syncSourceRect = () => {
      if (!heroController.isRevealSettled?.()) {
        return null;
      }

      state.sourceRect = heroController.getBlackCupSourceMetrics?.();
      return state.sourceRect;
    };

    const setStaticState = () => {
      heroController.setBlackCupTransitionVisibility?.(true);
      gsap.set(overlayCup, { opacity: 0, clearProps: "transform" });
      gsap.set(overlayCupBody, { rotation: sourceRotation });
      gsap.set(settledCup, {
        opacity: introComplete && reducedMotion ? 1 : 0
      });
      gsap.set(settledCupBody, { rotation: finalRotation });
    };

    if (prefersStatic) {
      setStaticState();
      return;
    }

    const renderTransition = (progress) => {
      const sourceRect = state.sourceRect ?? syncSourceRect();
      const targetRect = measureElementRect(settledCup);
      const metrics = buildCupTransitionMetrics(sourceRect, targetRect);

      if (!metrics) {
        setStaticState();
        return;
      }

      const { sourceRect: frozenSourceRect, translateX, translateY, scale } = metrics;
      const travelProgress = gsap.parseEase("power1.inOut")(Math.min(progress * 0.92, 1));
      const cupX = lerp(0, translateX, travelProgress);
      const cupY = lerp(0, translateY, travelProgress);
      const cupScale = lerp(1, scale, travelProgress);
      const cupRotation = lerp(sourceRotation, finalRotation, travelProgress);

      gsap.set(overlayCup, {
        x: frozenSourceRect.left + cupX,
        y: frozenSourceRect.top + cupY,
        scale: cupScale,
        opacity: getTransitionCupOpacity(progress)
      });
      gsap.set(overlayCupBody, { rotation: cupRotation });

      gsap.set(settledCup, { opacity: getSettledCupOpacity(progress) });
      gsap.set(settledCupBody, { rotation: finalRotation });
      heroController.setBlackCupTransitionVisibility?.(getHeroCupVisible(progress));
    };

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "center 42%",
      scrub: 1.7,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        syncSourceRect();
        renderTransition(self.progress);
      },
      onUpdate: (self) => {
        renderTransition(self.progress);
      },
      onLeaveBack: () => {
        heroController.setBlackCupTransitionVisibility?.(true);
        gsap.set(overlayCup, { opacity: 0, clearProps: "transform" });
        gsap.set(overlayCupBody, { rotation: sourceRotation });
        gsap.set(settledCup, { opacity: 0 });
        gsap.set(settledCupBody, { rotation: finalRotation });
      }
    });

    renderTransition(0);

    return () => {
      trigger.kill();
      setStaticState();
    };
  }, root);

  return () => {
    ctx.revert();
  };
}
