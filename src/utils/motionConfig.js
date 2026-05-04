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
  const edgeOverscanPx = (tierGeometry.edgeOverscanPx || 0) * scale;

  const leftGroupWidth = viewportCenterX + seamGapPx;
  const rightGroupWidth = safeViewportWidth - viewportCenterX + seamGapPx;
  const leftPanelLeft = edgeOverscanPx + leftGroupWidth - geometry.leftSeamAnchorX * scale;
  const rightPanelLeft = -geometry.rightSeamAnchorX * scale;
  const leftBean = tierGeometry.leftBean || geometry.leftBean;
  const rightBean = tierGeometry.rightBean || geometry.rightBean;
  const leftBeanImage = tierGeometry.leftBeanImage || geometry.leftBeanImage;
  const rightBeanImage = tierGeometry.rightBeanImage || geometry.rightBeanImage;
  const leftShadow = tierGeometry.leftShadow || geometry.leftShadow;
  const rightShadow = tierGeometry.rightShadow || geometry.rightShadow;
  const progress = tierGeometry.progress || geometry.progress;
  const logo = tierGeometry.logo || geometry.logo;
  const leftFragments = tierGeometry.fragments?.left || geometry.fragments.left;
  const rightFragments = tierGeometry.fragments?.right || geometry.fragments.right;

  return {
    scale,
    leftGroup: {
      left: -edgeOverscanPx,
      width: leftGroupWidth + edgeOverscanPx,
      transformOrigin: "100% 50%"
    },
    rightGroup: {
      left: viewportCenterX - seamGapPx,
      width: rightGroupWidth + edgeOverscanPx,
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
    leftBeanImage: offsetScaledBox(leftBeanImage, scale, leftPanelLeft),
    rightBeanImage: offsetScaledBox(rightBeanImage, scale, rightPanelLeft),
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
    },
    fractureClip: geometry.fractureClip
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
      midHold: 360,
      midToEnd: 2700
    },
    easing: {
      loaderFade: "cubic-bezier(0.23, 1, 0.32, 1)",
      startToMid: "cubic-bezier(0.5, 0, 0.2, 1)",
      midHold: "linear",
      midToEnd: "cubic-bezier(0.5, 0.1, 0.5, 1)"
    },
    geometry: {
      designHeight: 1080,
      // These widths and seam anchors match the reveal door geometry so the
      // crack edge seats into the bean break instead of reading like a flat slit.
      leftAssetWidth: 1012,
      rightAssetWidth: 986,
      leftSeamAnchorX: 914,
      rightSeamAnchorX: 72,
      leftBean: {
        left: 852,
        top: 318,
        width: 149,
        height: 334
      },
      rightBean: {
        left: 52,
        top: 318,
        width: 149,
        height: 334
      },
      leftBeanImage: {
        left: 744,
        top: 318,
        width: 298,
        height: 334
      },
      rightBeanImage: {
        left: -97,
        top: 318,
        width: 298,
        height: 334
      },
      fractureClip: {
        left:
          "polygon(0% 0%, 58% 0%, 56.5% 4%, 54.5% 8%, 52.8% 15%, 51.8% 23%, 52.6% 34%, 50.5% 44%, 51.6% 56%, 49.6% 68%, 51.2% 80%, 53.5% 91%, 56.5% 97%, 58.5% 100%, 0% 100%)",
        right:
          "polygon(100% 0%, 42% 0%, 43.5% 4%, 45.5% 8%, 47.2% 15%, 48.2% 23%, 47.4% 34%, 49.5% 44%, 48.4% 56%, 50.4% 68%, 48.8% 80%, 46.5% 91%, 43.5% 97%, 41.5% 100%, 100% 100%)"
      },
      logo: {
        width: 80,
        top: 68
      },
      progress: {
        width: 448,
        bottom: 340,
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
          edgeOverscanPx: 264,
          startSeamGapPx: 0
        },
        compact: {
          edgeOverscanPx: 220,
          startSeamGapPx: 0,
          logo: {
            width: 76,
            top: 64
          },
          progress: {
            width: 398,
            bottom: 392
          }
        },
        mobile: {
          edgeOverscanPx: 182,
          startSeamGapPx: 0,
          leftBean: {
            left: 858,
            top: 338,
            width: 138,
            height: 310
          },
          rightBean: {
            left: 48,
            top: 338,
            width: 138,
            height: 310
          },
          leftBeanImage: {
            left: 750,
            top: 338,
            width: 276,
            height: 310
          },
          rightBeanImage: {
            left: -90,
            top: 338,
            width: 276,
            height: 310
          },
          logo: {
            width: 74,
            top: 72
          },
          progress: {
            width: 360,
            bottom: 362
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
          { x: -164, y: -120, rotation: -16, scale: 0.8, opacity: 0.74 },
          { x: -220, y: -8, rotation: -42, scale: 0.74, opacity: 0.68 },
          { x: -154, y: 82, rotation: 18, scale: 0.8, opacity: 0.72 },
          { x: -178, y: 178, rotation: -22, scale: 0.72, opacity: 0.64 }
        ],
        midRight: [
          { x: 172, y: -110, rotation: 18, scale: 0.82, opacity: 0.72 },
          { x: 220, y: 0, rotation: -16, scale: 0.78, opacity: 0.68 },
          { x: 168, y: 88, rotation: -28, scale: 0.74, opacity: 0.66 },
          { x: 188, y: 182, rotation: -16, scale: 0.8, opacity: 0.64 }
        ],
        holdLeft: [
          { x: -176, y: -132, rotation: -18, scale: 0.82, opacity: 0.76 },
          { x: -236, y: -12, rotation: -46, scale: 0.76, opacity: 0.7 },
          { x: -166, y: 96, rotation: 22, scale: 0.82, opacity: 0.74 },
          { x: -188, y: 194, rotation: -24, scale: 0.74, opacity: 0.66 }
        ],
        holdRight: [
          { x: 182, y: -124, rotation: 20, scale: 0.82, opacity: 0.74 },
          { x: 236, y: 2, rotation: -18, scale: 0.8, opacity: 0.7 },
          { x: 176, y: 100, rotation: -30, scale: 0.76, opacity: 0.68 },
          { x: 198, y: 196, rotation: -18, scale: 0.82, opacity: 0.66 }
        ],
        endLeft: [
          { x: -328, y: -192, rotation: -34, scale: 0.9, opacity: 0.82 },
          { x: -412, y: -26, rotation: -88, scale: 0.82, opacity: 0.72 },
          { x: -318, y: 146, rotation: 42, scale: 0.88, opacity: 0.78 },
          { x: -350, y: 294, rotation: -40, scale: 0.8, opacity: 0.66 }
        ],
        endRight: [
          { x: 316, y: -186, rotation: 34, scale: 0.9, opacity: 0.8 },
          { x: 410, y: -14, rotation: -34, scale: 0.84, opacity: 0.72 },
          { x: 308, y: 154, rotation: -48, scale: 0.78, opacity: 0.68 },
          { x: 342, y: 302, rotation: -28, scale: 0.86, opacity: 0.64 }
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
          left: { x: -118, xPercent: 0, yPercent: -0.4, scale: 1.12, opacity: 1 },
          right: { x: 118, xPercent: 0, yPercent: -0.4, scale: 1.12, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.52, xPercent: 0, yPercent: -5.4, scale: 2.66, opacity: 1 },
          right: { xViewport: 1.52, xPercent: 0, yPercent: -5.4, scale: 2.66, opacity: 1 }
        }
      },
      compact: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -96, xPercent: 0, yPercent: -0.4, scale: 1.1, opacity: 1 },
          right: { x: 96, xPercent: 0, yPercent: -0.4, scale: 1.1, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.44, xPercent: 0, yPercent: -4.7, scale: 2.42, opacity: 1 },
          right: { xViewport: 1.44, xPercent: 0, yPercent: -4.7, scale: 2.42, opacity: 1 }
        }
      },
      mobile: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -76, xPercent: 0, yPercent: -0.2, scale: 1.08, opacity: 1 },
          right: { x: 76, xPercent: 0, yPercent: -0.2, scale: 1.08, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.32, xPercent: 0, yPercent: -3.4, scale: 2.08, opacity: 1 },
          right: { xViewport: 1.32, xPercent: 0, yPercent: -3.4, scale: 2.08, opacity: 1 }
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
