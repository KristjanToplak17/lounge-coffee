import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-smooth-scroll");
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1,
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1
    });

    let frameId = 0;

    const onScroll = () => {
      ScrollTrigger.update();
    };

    const onFrame = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(onFrame);
    };

    document.documentElement.classList.add("has-smooth-scroll");
    lenis.on("scroll", onScroll);
    frameId = window.requestAnimationFrame(onFrame);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      document.documentElement.classList.remove("has-smooth-scroll");
      ScrollTrigger.refresh();
    };
  }, [enabled]);
}
