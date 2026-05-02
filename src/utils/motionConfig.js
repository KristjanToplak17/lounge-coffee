/**
 * @typedef {"desktop" | "compact" | "mobile"} LoaderViewportTier
 * @typedef {"start" | "mid" | "end" | null} IntroDebugState
 */

const INTRO_DEBUG_STATE_VALUES = new Set(["start", "mid", "end"]);

export function getLoaderViewportTier(viewportWidth) {
  if (viewportWidth <= 720) {
    return "mobile";
  }

  if (viewportWidth <= 1120) {
    return "compact";
  }

  return "desktop";
}

export function getIntroDebugState() {
  if (typeof window !== "undefined") {
    const debugValue = new URLSearchParams(window.location.search).get("introDebug");

    if (debugValue === "null") {
      return null;
    }

    if (INTRO_DEBUG_STATE_VALUES.has(debugValue)) {
      return debugValue;
    }
  }

  return motionConfig.loader.debugState;
}

function scaleBox(box, scale) {
  return {
    left: box.left * scale,
    top: box.top * scale,
    width: box.width * scale,
    height: box.height * scale
  };
}

export function getIntroRevealGeometry(viewportWidth, viewportHeight) {
  const geometry = motionConfig.loader.geometry;
  const safeViewportWidth = Math.max(1, viewportWidth || 0);
  const safeViewportHeight = Math.max(1, viewportHeight || 0);
  const viewportCenterX = safeViewportWidth / 2;
  const heightScale = safeViewportHeight / geometry.designHeight;
  const leftCoverageScale = viewportCenterX / geometry.leftSeamAnchorX;
  const rightCoverageScale =
    viewportCenterX / (geometry.rightAssetWidth - geometry.rightSeamAnchorX);
  const scale = Math.max(heightScale, leftCoverageScale, rightCoverageScale);

  const leftGroupLeft = viewportCenterX - geometry.leftSeamAnchorX * scale;
  const rightGroupLeft = viewportCenterX - geometry.rightSeamAnchorX * scale;

  return {
    scale,
    leftGroup: {
      left: leftGroupLeft,
      width: geometry.leftAssetWidth * scale,
      transformOrigin: `${(geometry.leftSeamAnchorX / geometry.leftAssetWidth) * 100}% 50%`
    },
    rightGroup: {
      left: rightGroupLeft,
      width: geometry.rightAssetWidth * scale,
      transformOrigin: `${(geometry.rightSeamAnchorX / geometry.rightAssetWidth) * 100}% 50%`
    },
    leftBean: scaleBox(geometry.leftBean, scale),
    rightBean: scaleBox(geometry.rightBean, scale),
    leftShadow: scaleBox(geometry.leftShadow, scale),
    rightShadow: scaleBox(geometry.rightShadow, scale),
    progress: {
      width: geometry.progress.width * scale,
      bottom: geometry.progress.bottom * scale
    },
    logo: {
      width: geometry.logo.width * scale,
      top: geometry.logo.top * scale
    },
    fragments: {
      left: geometry.fragments.left.map((fragment) => scaleBox(fragment, scale)),
      right: geometry.fragments.right.map((fragment) => scaleBox(fragment, scale))
    }
  };
}

export const motionConfig = {
  loader: {
    debugState: null,
    timingsMs: {
      initialHold: 300,
      loaderFill: 1080,
      loaderCompleteHold: 500,
      loaderFade: 220,
      startToMid: 1550,
      midHold: 600,
      midToEnd: 2000
    },
    easing: {
      loaderFade: "cubic-bezier(0.23, 1, 0.32, 1)",
      startToMid: "cubic-bezier(0.5, 0, 0.2, 1)",
      midHold: "linear",
      midToEnd: "cubic-bezier(0.5, 0.1, 0.5, 1)"
    },
    geometry: {
      designHeight: 1080,
      leftAssetWidth: 1011.5,
      rightAssetWidth: 985.5,
      leftSeamAnchorX: 951.5,
      rightSeamAnchorX: 25.5,
      leftBean: {
        left: 866,
        top: 355,
        width: 122,
        height: 273
      },
      rightBean: {
        left: -13,
        top: 355,
        width: 121,
        height: 273
      },
      logo: {
        width: 71,
        top: 34
      },
      progress: {
        width: 300,
        bottom: 294
      },
      leftShadow: {
        left: 0,
        top: 640,
        width: 705,
        height: 384
      },
      rightShadow: {
        left: 0,
        top: 0,
        width: 1247,
        height: 680
      },
      fragments: {
        left: [
          { left: 934, top: 468, width: 31, height: 45 },
          { left: 922, top: 486, width: 41, height: 41 },
          { left: 926, top: 472, width: 57, height: 55 },
          { left: 942, top: 506, width: 28, height: 32 }
        ],
        right: [
          { left: 26, top: 468, width: 33, height: 44 },
          { left: 34, top: 482, width: 46, height: 40 },
          { left: 28, top: 488, width: 62, height: 42 },
          { left: 22, top: 466, width: 59, height: 84 }
        ]
      }
    },
    fragments: {
      desktop: {
        start: [
          { x: -10, y: 10, rotation: -8, scale: 0.74, opacity: 0.02 },
          { x: -4, y: 8, rotation: 10, scale: 0.72, opacity: 0.02 },
          { x: -8, y: -2, rotation: -10, scale: 0.76, opacity: 0.02 },
          { x: -2, y: 6, rotation: 8, scale: 0.7, opacity: 0.02 }
        ],
        midLeft: [
          { x: -176, y: -84, rotation: -44, scale: 0.92, opacity: 1 },
          { x: -122, y: 78, rotation: -122, scale: 0.9, opacity: 1 },
          { x: -94, y: -18, rotation: 58, scale: 0.94, opacity: 1 },
          { x: -68, y: -142, rotation: -28, scale: 0.88, opacity: 1 }
        ],
        midRight: [
          { x: 118, y: -10, rotation: 52, scale: 0.94, opacity: 1 },
          { x: 170, y: -102, rotation: -24, scale: 0.92, opacity: 1 },
          { x: 122, y: 92, rotation: -54, scale: 0.9, opacity: 1 },
          { x: 148, y: -176, rotation: -18, scale: 0.98, opacity: 1 }
        ],
        holdLeft: [
          { x: -194, y: -92, rotation: -52, scale: 0.95, opacity: 1 },
          { x: -136, y: 88, rotation: -132, scale: 0.92, opacity: 1 },
          { x: -106, y: -26, rotation: 68, scale: 0.96, opacity: 1 },
          { x: -80, y: -156, rotation: -34, scale: 0.9, opacity: 1 }
        ],
        holdRight: [
          { x: 132, y: -18, rotation: 56, scale: 0.96, opacity: 1 },
          { x: 186, y: -114, rotation: -28, scale: 0.94, opacity: 1 },
          { x: 136, y: 102, rotation: -60, scale: 0.92, opacity: 1 },
          { x: 160, y: -192, rotation: -20, scale: 1, opacity: 1 }
        ],
        endLeft: [
          { x: -532, y: -212, rotation: -106, scale: 1.22, opacity: 0.94 },
          { x: -402, y: 212, rotation: -208, scale: 1.18, opacity: 0.92 },
          { x: -338, y: -82, rotation: 154, scale: 1.18, opacity: 0.94 },
          { x: -292, y: -302, rotation: -118, scale: 1.12, opacity: 0.9 }
        ],
        endRight: [
          { x: 352, y: -38, rotation: 118, scale: 1.18, opacity: 0.94 },
          { x: 496, y: -224, rotation: -76, scale: 1.18, opacity: 0.92 },
          { x: 358, y: 214, rotation: -122, scale: 1.12, opacity: 0.9 },
          { x: 412, y: -382, rotation: -64, scale: 1.22, opacity: 0.94 }
        ]
      }
    },
    shadows: {
      start: {
        left: { opacity: 0.1, scale: 1, xPercent: 0, yPercent: 0 },
        right: { opacity: 0.1, scale: 1, xPercent: 0, yPercent: 0 }
      },
      mid: {
        left: { opacity: 0.14, scale: 1.08, xPercent: -2, yPercent: 1 },
        right: { opacity: 0.13, scale: 1.05, xPercent: 2, yPercent: -1 }
      },
      end: {
        left: { opacity: 0.03, scale: 1.3, xPercent: -8, yPercent: 8 },
        right: { opacity: 0.03, scale: 1.22, xPercent: 6, yPercent: -4 }
      }
    },
    groups: {
      desktop: {
        start: {
          left: { xPercent: 0.7, yPercent: 0, scale: 1, opacity: 1 },
          right: { xPercent: -0.7, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { xPercent: -12, yPercent: 0, scale: 1.2, opacity: 1 },
          right: { xPercent: 12, yPercent: 0, scale: 1.2, opacity: 1 }
        },
        end: {
          left: { xPercent: -88, yPercent: -3, scale: 3.52, opacity: 1 },
          right: { xPercent: 88, yPercent: -3, scale: 3.52, opacity: 1 }
        }
      },
      compact: {
        start: {
          left: { xPercent: 0.6, yPercent: 0, scale: 1, opacity: 1 },
          right: { xPercent: -0.6, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { xPercent: -10, yPercent: 0, scale: 1.17, opacity: 1 },
          right: { xPercent: 10, yPercent: 0, scale: 1.17, opacity: 1 }
        },
        end: {
          left: { xPercent: -78, yPercent: -3, scale: 3.08, opacity: 1 },
          right: { xPercent: 78, yPercent: -3, scale: 3.08, opacity: 1 }
        }
      },
      mobile: {
        start: {
          left: { xPercent: 0.5, yPercent: 0, scale: 1, opacity: 1 },
          right: { xPercent: -0.5, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { xPercent: -8, yPercent: 0, scale: 1.14, opacity: 1 },
          right: { xPercent: 8, yPercent: 0, scale: 1.14, opacity: 1 }
        },
        end: {
          left: { xPercent: -64, yPercent: -2, scale: 2.74, opacity: 1 },
          right: { xPercent: 64, yPercent: -2, scale: 2.74, opacity: 1 }
        }
      }
    },
    reducedMotion: {
      left: { xPercent: -20, scale: 1.1, opacity: 1 },
      right: { xPercent: 20, scale: 1.1, opacity: 1 }
    }
  },
  stickyTransitionStart: "top top",
  stickyTransitionEnd: "+=120%"
};
