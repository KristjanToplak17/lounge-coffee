import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

export const DESIGN_HEIGHT = 1080;
export const LEFT_PANEL_DESIGN_WIDTH = 1010;
export const RIGHT_PANEL_DESIGN_WIDTH = 1010;
export const START_OVERLAP_DESIGN_PX = 74;
export const MID_TRAVEL_DESIGN_PX = 96;
export const MID_SCALE = 1.16;
export const END_SCALE = 6.0;

export const LOADER_TIMING = {
  initialHold: 0.2,
  loaderFill: 0.65,
  loaderCompleteHold: 0.3,
  loaderFade: 0.2,
  startToMid: 1.3,
  midHold: 0.3,
  midToEnd: 2.6
};

export const REDUCED_TIMING = {
  initialHold: 0.08,
  loaderFill: 0.4,
  loaderCompleteHold: 0.08,
  loaderFade: 0.18,
  startToMid: 0.45,
  midHold: 0.05,
  midToEnd: 0.6
};

export const EASE = {
  loaderFade: "cubic-bezier(0.9, 0.4, 0.4, 1)",
  startToMid: "cubic-bezier(0.1, 0.5, 0.7, 1)",
  midToEnd: "cubic-bezier(0.8, 0.9, 0.3, 1)"
};

export const LEFT_BEAN = {
  left: 867,
  top: 401,
  width: 124,
  height: 278
};

export const RIGHT_BEAN = {
  left: -1,
  top: 403,
  width: 123,
  height: 273
};

export const LOGO = {
  top: 116,
  width: 92,
  height: 92
};

export const PROGRESS = {
  top: 750,
  width: 256,
  height: 6
};

export const SHADOWS = {
  right: {
    right: -156,
    top: 0,
    width: 600,
    height: 400,
    opacity: 0.1
  }
};

export const FRAGMENTS = {
  left: [
    { left: 820, top: 400, width: 36, height: 40, xMid: -16, yMid: -24, rotationMid: -16, xEnd: -42, yEnd: -58, rotationEnd: -34 },
    { left: 770, top: 464, width: 28, height: 32, xMid: -22, yMid: -6, rotationMid: -20, xEnd: -52, yEnd: -10, rotationEnd: -48 },
    { left: 820, top: 550, width: 26, height: 30, xMid: -24, yMid: 18, rotationMid: -18, xEnd: -56, yEnd: 44, rotationEnd: -40 },
    { left: 780, top: 620, width: 40, height: 44, xMid: -18, yMid: 30, rotationMid: -14, xEnd: -48, yEnd: 68, rotationEnd: -30 }
  ],
  right: [
    { left: 140, top: 404, width: 38, height: 40, xMid: 16, yMid: -26, rotationMid: 16, xEnd: 42, yEnd: -56, rotationEnd: 34 },
    { left: 126, top: 472, width: 26, height: 28, xMid: 24, yMid: -4, rotationMid: 18, xEnd: 50, yEnd: -8, rotationEnd: 42 },
    { left: 190, top: 544, width: 28, height: 30, xMid: 24, yMid: 20, rotationMid: 16, xEnd: 54, yEnd: 46, rotationEnd: 38 },
    { left: 130, top: 602, width: 38, height: 42, xMid: 18, yMid: 28, rotationMid: 14, xEnd: 46, yEnd: 64, rotationEnd: 30 }
  ]
};

export const INTRO_DEBUG_STATES = new Set(["start", "mid", "end"]);
export const TEST_REVEAL_STATES = new Set(["start", "mid", "end", "live"]);

export function getViewportSize() {
  if (typeof window === "undefined") {
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function readQuerySceneState(queryKey, defaultState, allowedStates) {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const params = new URLSearchParams(window.location.search);
  const state = params.get(queryKey);

  if (state && allowedStates.has(state)) {
    return state;
  }

  return defaultState;
}

export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState(getViewportSize);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const updateViewportSize = () => {
      setViewportSize(getViewportSize());
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  return viewportSize;
}

export function useQuerySceneState(queryKey, defaultState, allowedStates) {
  const [sceneState, setSceneState] = useState(() =>
    readQuerySceneState(queryKey, defaultState, allowedStates)
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const updateState = () => {
      setSceneState(readQuerySceneState(queryKey, defaultState, allowedStates));
    };

    updateState();
    window.addEventListener("popstate", updateState);

    return () => window.removeEventListener("popstate", updateState);
  }, [allowedStates, defaultState, queryKey]);

  return sceneState;
}

export function updateQuerySceneState(queryKey, nextState) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set(queryKey, nextState);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useBakedIntroRefs() {
  return {
    rootRef: useRef(null),
    backdropRef: useRef(null),
    logoRef: useRef(null),
    progressRef: useRef(null),
    progressFillRef: useRef(null),
    heroRevealStartedRef: useRef(false),
    leftPanelGroupRef: useRef(null),
    rightPanelGroupRef: useRef(null),
    leftContentGroupRef: useRef(null),
    rightContentGroupRef: useRef(null),
    leftSeamCapRef: useRef(null),
    rightSeamCapRef: useRef(null),
    rightShadowRef: useRef(null),
    leftFragmentRefs: useRef([]),
    rightFragmentRefs: useRef([])
  };
}

export function useBakedIntroGeometry(viewportSize) {
  return useMemo(() => {
    const artScale = viewportSize.height / DESIGN_HEIGHT;
    const leftPanelWidth = LEFT_PANEL_DESIGN_WIDTH * artScale;
    const rightPanelWidth = RIGHT_PANEL_DESIGN_WIDTH * artScale;
    const panelHeight = DESIGN_HEIGHT * artScale;
    const centerX = viewportSize.width / 2;
    const startOverlapPx = START_OVERLAP_DESIGN_PX * artScale;
    const leftStartX = centerX - leftPanelWidth + startOverlapPx / 2;
    const rightStartX = centerX - startOverlapPx / 2;
    const leftExtensionWidth = Math.max(0, leftStartX);
    const rightExtensionWidth = Math.max(0, viewportSize.width - (rightStartX + rightPanelWidth));
    const seamCapWidth = 116 * artScale;
    const midTravel = MID_TRAVEL_DESIGN_PX * artScale;
    const exitDistance = Math.max(viewportSize.width, leftPanelWidth, rightPanelWidth) * 1.1;
    const leftEndX = leftStartX - exitDistance;
    const rightEndX = rightStartX + exitDistance;

    return {
      artScale,
      panelHeight,
      startOverlapPx,
      midTravel,
      exitDistance,
      leftStartX,
      rightStartX,
      leftEndX,
      rightEndX,
      logo: {
        top: LOGO.top * artScale,
        width: LOGO.width * artScale,
        height: LOGO.height * artScale
      },
      progress: {
        top: PROGRESS.top * artScale,
        width: PROGRESS.width * artScale,
        height: Math.max(3, PROGRESS.height * artScale)
      },
      leftGroup: {
        left: leftStartX,
        width: leftPanelWidth,
        extensionWidth: leftExtensionWidth,
        seamCapWidth
      },
      rightGroup: {
        left: rightStartX,
        width: rightPanelWidth,
        extensionWidth: rightExtensionWidth,
        seamCapWidth
      },
      leftBean: {
        left: LEFT_BEAN.left * artScale,
        top: LEFT_BEAN.top * artScale,
        width: LEFT_BEAN.width * artScale,
        height: LEFT_BEAN.height * artScale
      },
      rightBean: {
        left: RIGHT_BEAN.left * artScale,
        top: RIGHT_BEAN.top * artScale,
        width: RIGHT_BEAN.width * artScale,
        height: RIGHT_BEAN.height * artScale
      },
      shadows: {
        right: {
          right: SHADOWS.right.right * artScale,
          top: SHADOWS.right.top * artScale,
          width: SHADOWS.right.width * artScale,
          height: SHADOWS.right.height * artScale,
          opacity: SHADOWS.right.opacity
        }
      }
    };
  }, [viewportSize.height, viewportSize.width]);
}

export function getFragmentStyles(fragment, artScale) {
  return {
    left: fragment.left * artScale,
    top: fragment.top * artScale,
    width: fragment.width * artScale,
    height: fragment.height * artScale
  };
}

export function getScaledFragmentMotion(fragment, artScale) {
  return {
    xMid: fragment.xMid * artScale,
    yMid: fragment.yMid * artScale,
    xEnd: fragment.xEnd * artScale,
    yEnd: fragment.yEnd * artScale,
    rotationMid: fragment.rotationMid,
    rotationEnd: fragment.rotationEnd
  };
}

export function setFragmentState(elements, fragments, artScale, state) {
  elements.forEach((element, index) => {
    const fragment = fragments[index];
    const motion = getScaledFragmentMotion(fragment, artScale);

    if (!element) {
      return;
    }

    if (state === "start") {
      gsap.set(element, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 0.92 });
      return;
    }

    if (state === "mid") {
      gsap.set(element, {
        opacity: 0.9,
        x: motion.xMid,
        y: motion.yMid,
        rotation: motion.rotationMid,
        scale: 1
      });
      return;
    }

    gsap.set(element, {
      opacity: 0,
      x: motion.xEnd,
      y: motion.yEnd,
      rotation: motion.rotationEnd,
      scale: 1.04
    });
  });
}
