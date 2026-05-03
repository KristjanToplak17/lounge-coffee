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

function offsetScaledBox(box, scale, offsetX = 0) {
  return {
    left: offsetX + box.left * scale,
    top: box.top * scale,
    width: box.width * scale,
    height: box.height * scale
  };
}

export function getIntroRevealGeometry(viewportWidth, viewportHeight) {
  const geometry = motionConfig.loader.geometry;
  const safeViewportWidth = Math.max(1, viewportWidth || 0);
  const safeViewportHeight = Math.max(1, viewportHeight || 0);
  const tier = getLoaderViewportTier(safeViewportWidth);
  const tierGeometry = geometry.tiers?.[tier] || {};
  const viewportCenterX = safeViewportWidth / 2;
  const scale = safeViewportHeight / geometry.designHeight;
  const seamGapPx = (tierGeometry.startSeamGapPx || 0) / 2;

  const leftGroupWidth = viewportCenterX + seamGapPx;
  const rightGroupWidth = safeViewportWidth - viewportCenterX + seamGapPx;
  const leftPanelLeft = leftGroupWidth - geometry.leftSeamAnchorX * scale;
  const rightPanelLeft = -geometry.rightSeamAnchorX * scale;
  const leftBean = tierGeometry.leftBean || geometry.leftBean;
  const rightBean = tierGeometry.rightBean || geometry.rightBean;
  const leftShadow = tierGeometry.leftShadow || geometry.leftShadow;
  const rightShadow = tierGeometry.rightShadow || geometry.rightShadow;
  const progress = tierGeometry.progress || geometry.progress;
  const logo = tierGeometry.logo || geometry.logo;
  const leftFragments = tierGeometry.fragments?.left || geometry.fragments.left;
  const rightFragments = tierGeometry.fragments?.right || geometry.fragments.right;

  return {
    scale,
    leftGroup: {
      left: 0,
      width: leftGroupWidth,
      transformOrigin: "100% 50%"
    },
    rightGroup: {
      left: viewportCenterX - seamGapPx,
      width: rightGroupWidth,
      transformOrigin: "0% 50%"
    },
    leftPanel: {
      left: leftPanelLeft,
      width: geometry.leftAssetWidth * scale,
      height: safeViewportHeight
    },
    rightPanel: {
      left: rightPanelLeft,
      width: geometry.rightAssetWidth * scale,
      height: safeViewportHeight
    },
    leftBean: offsetScaledBox(leftBean, scale, leftPanelLeft),
    rightBean: offsetScaledBox(rightBean, scale, rightPanelLeft),
    leftShadow: offsetScaledBox(leftShadow, scale, leftPanelLeft),
    rightShadow: offsetScaledBox(rightShadow, scale, rightPanelLeft),
    progress: {
      width: progress.width * scale,
      bottom: progress.bottom * scale
    },
    logo: {
      width: logo.width * scale,
      top: logo.top * scale
    },
    fragments: {
      left: leftFragments.map((fragment) => offsetScaledBox(fragment, scale, leftPanelLeft)),
      right: rightFragments.map((fragment) => offsetScaledBox(fragment, scale, rightPanelLeft))
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
      midToEnd: "cubic-bezier(0.22, 1, 0.36, 1)"
    },
    geometry: {
      designHeight: 1080,
      leftAssetWidth: 1011.5,
      rightAssetWidth: 985.5,
      leftSeamAnchorX: 951.5,
      rightSeamAnchorX: 25.5,
      leftBean: {
        left: 842,
        top: 318,
        width: 149,
        height: 334
      },
      rightBean: {
        left: -18,
        top: 318,
        width: 149,
        height: 334
      },
      logo: {
        width: 84,
        top: 60
      },
      progress: {
        width: 448,
        bottom: 410
      },
      leftShadow: {
        left: -88,
        top: 690,
        width: 620,
        height: 336
      },
      rightShadow: {
        left: 212,
        top: -34,
        width: 954,
        height: 520
      },
      fragments: {
        left: [
          { left: 937, top: 470, width: 28, height: 40 },
          { left: 930, top: 482, width: 36, height: 34 },
          { left: 933, top: 474, width: 48, height: 46 },
          { left: 944, top: 500, width: 25, height: 29 }
        ],
        right: [
          { left: 28, top: 470, width: 30, height: 39 },
          { left: 35, top: 482, width: 38, height: 34 },
          { left: 30, top: 487, width: 50, height: 36 },
          { left: 24, top: 466, width: 48, height: 70 }
        ]
      },
      tiers: {
        desktop: {
          edgeOverscanPx: 164,
          startSeamGapPx: 4
        },
        compact: {
          edgeOverscanPx: 136,
          startSeamGapPx: 4,
          logo: {
            width: 78,
            top: 58
          },
          progress: {
            width: 398,
            bottom: 388
          }
        },
        mobile: {
          edgeOverscanPx: 122,
          startSeamGapPx: 4,
          leftBean: {
            left: 848,
            top: 338,
            width: 138,
            height: 310
          },
          rightBean: {
            left: -10,
            top: 338,
            width: 138,
            height: 310
          },
          logo: {
            width: 78,
            top: 68
          },
          progress: {
            width: 360,
            bottom: 350
          },
          leftShadow: {
            left: -72,
            top: 726,
            width: 560,
            height: 302
          },
          rightShadow: {
            left: 246,
            top: -18,
            width: 826,
            height: 450
          }
        }
      }
    },
    fragments: {
      desktop: {
        start: [
          { x: -4, y: 7, rotation: -4, scale: 0.68, opacity: 0.01 },
          { x: -2, y: 6, rotation: 6, scale: 0.66, opacity: 0.01 },
          { x: -5, y: -1, rotation: -7, scale: 0.7, opacity: 0.01 },
          { x: -1, y: 4, rotation: 5, scale: 0.64, opacity: 0.01 }
        ],
        midLeft: [
          { x: -116, y: -28, rotation: -18, scale: 0.84, opacity: 0.94 },
          { x: -98, y: 44, rotation: -58, scale: 0.8, opacity: 0.86 },
          { x: -84, y: -8, rotation: 26, scale: 0.86, opacity: 0.92 },
          { x: -72, y: -62, rotation: -22, scale: 0.78, opacity: 0.8 }
        ],
        midRight: [
          { x: 96, y: -8, rotation: 24, scale: 0.84, opacity: 0.9 },
          { x: 112, y: -42, rotation: -18, scale: 0.82, opacity: 0.82 },
          { x: 94, y: 46, rotation: -30, scale: 0.78, opacity: 0.8 },
          { x: 108, y: -58, rotation: -16, scale: 0.86, opacity: 0.78 }
        ],
        holdLeft: [
          { x: -116, y: -28, rotation: -18, scale: 0.84, opacity: 0.94 },
          { x: -98, y: 44, rotation: -58, scale: 0.8, opacity: 0.86 },
          { x: -84, y: -8, rotation: 26, scale: 0.86, opacity: 0.92 },
          { x: -72, y: -62, rotation: -22, scale: 0.78, opacity: 0.8 }
        ],
        holdRight: [
          { x: 96, y: -8, rotation: 24, scale: 0.84, opacity: 0.9 },
          { x: 112, y: -42, rotation: -18, scale: 0.82, opacity: 0.82 },
          { x: 94, y: 46, rotation: -30, scale: 0.78, opacity: 0.8 },
          { x: 108, y: -58, rotation: -16, scale: 0.86, opacity: 0.78 }
        ],
        endLeft: [
          { x: -116, y: -28, rotation: -18, scale: 0.84, opacity: 0.94 },
          { x: -98, y: 44, rotation: -58, scale: 0.8, opacity: 0.86 },
          { x: -84, y: -8, rotation: 26, scale: 0.86, opacity: 0.92 },
          { x: -72, y: -62, rotation: -22, scale: 0.78, opacity: 0.8 }
        ],
        endRight: [
          { x: 96, y: -8, rotation: 24, scale: 0.84, opacity: 0.9 },
          { x: 112, y: -42, rotation: -18, scale: 0.82, opacity: 0.82 },
          { x: 94, y: 46, rotation: -30, scale: 0.78, opacity: 0.8 },
          { x: 108, y: -58, rotation: -16, scale: 0.86, opacity: 0.78 }
        ]
      }
    },
    shadows: {
      start: {
        left: { opacity: 0.08, scale: 1, xPercent: 0, yPercent: 0 },
        right: { opacity: 0.075, scale: 1, xPercent: 0, yPercent: 0 }
      },
      mid: {
        left: { opacity: 0.1, scale: 1.04, xPercent: -1, yPercent: 1 },
        right: { opacity: 0.09, scale: 1.03, xPercent: 1, yPercent: -1 }
      },
      end: {
        left: { opacity: 0.02, scale: 1.12, xPercent: -4, yPercent: 6 },
        right: { opacity: 0.02, scale: 1.1, xPercent: 4, yPercent: -3 }
      }
    },
    groups: {
      desktop: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -66, xPercent: 0, yPercent: -0.4, scale: 1.08, opacity: 1 },
          right: { x: 66, xPercent: 0, yPercent: -0.4, scale: 1.08, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.28, xPercent: 0, yPercent: -4.4, scale: 2.28, opacity: 1 },
          right: { xViewport: 1.28, xPercent: 0, yPercent: -4.4, scale: 2.28, opacity: 1 }
        }
      },
      compact: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -56, xPercent: 0, yPercent: -0.4, scale: 1.07, opacity: 1 },
          right: { x: 56, xPercent: 0, yPercent: -0.4, scale: 1.07, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.2, xPercent: 0, yPercent: -3.8, scale: 2.12, opacity: 1 },
          right: { xViewport: 1.2, xPercent: 0, yPercent: -3.8, scale: 2.12, opacity: 1 }
        }
      },
      mobile: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -42, xPercent: 0, yPercent: -0.2, scale: 1.05, opacity: 1 },
          right: { x: 42, xPercent: 0, yPercent: -0.2, scale: 1.05, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.1, xPercent: 0, yPercent: -2.7, scale: 1.84, opacity: 1 },
          right: { xViewport: 1.1, xPercent: 0, yPercent: -2.7, scale: 1.84, opacity: 1 }
        }
      }
    },
    reducedMotion: {
      left: { xPercent: -14, scale: 1.08, opacity: 1 },
      right: { xPercent: 14, scale: 1.08, opacity: 1 }
    }
  },
  stickyTransitionStart: "top top",
  stickyTransitionEnd: "+=120%"
};
