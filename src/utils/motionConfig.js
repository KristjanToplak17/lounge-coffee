/**
 * @typedef {"desktop" | "compact" | "mobile"} LoaderViewportTier
 * @typedef {"start" | "mid" | "end" | null} IntroDebugState
 */

const INTRO_DEBUG_STATE_VALUES = new Set(["start", "mid", "end"]);
const REVEAL_SIDES = ["left", "right"];
const REVEAL_GROUP_CLIP_PATHS = {
  closed: {
    left: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    right: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
  },
  open: {
    left:
      "polygon(0% 0%, 100% 0%, 99.78% 16%, 99.96% 34%, 99.3% 58%, 99.88% 82%, 99.08% 100%, 0% 100%)",
    right:
      "polygon(0.22% 0%, 100% 0%, 100% 100%, 0.92% 100%, 0.12% 82%, 0.7% 58%, 0.04% 34%, 0.3% 16%)"
  }
};

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

function resolveGroupAnchorBox(box, scale, groupWidth, viewportHeight) {
  const width = box.width * scale;
  const height = box.height * scale;

  return {
    left:
      box.left !== undefined
        ? box.left * scale
        : groupWidth - width - (box.right || 0) * scale,
    top:
      box.top !== undefined
        ? box.top * scale
        : viewportHeight - height - (box.bottom || 0) * scale,
    width,
    height
  };
}

function getTierSideGeometry(tierGeometry, side) {
  return tierGeometry.sides?.[side] || {};
}

function buildRevealSideGeometry({
  side,
  scale,
  geometry,
  tierGeometry,
  panelLeft,
  groupWidth,
  viewportHeight
}) {
  const baseSide = geometry.sides[side];
  const tierSide = getTierSideGeometry(tierGeometry, side);
  const sideGeometry = {
    bean: tierSide.bean || baseSide.bean,
    shadow: tierSide.shadow || baseSide.shadow,
    fragments: tierSide.fragments || baseSide.fragments
  };

  return {
    panel: {
      left: panelLeft,
      width: (side === "left" ? geometry.leftAssetWidth : geometry.rightAssetWidth) * scale,
      height: viewportHeight
    },
    bean: offsetScaledBox(sideGeometry.bean, scale, panelLeft),
    shadow: resolveGroupAnchorBox(sideGeometry.shadow, scale, groupWidth, viewportHeight),
    fragments: sideGeometry.fragments.map((fragment) => offsetScaledBox(fragment, scale, panelLeft))
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
  const progress = tierGeometry.progress || geometry.progress;
  const logo = tierGeometry.logo || geometry.logo;

  return {
    scale,
    sides: {
      left: {
        group: {
          left: -edgeOverscanPx,
          width: leftGroupWidth + edgeOverscanPx,
          transformOrigin: "100% 50%",
          clipPathClosed: REVEAL_GROUP_CLIP_PATHS.closed.left,
          clipPathOpen: REVEAL_GROUP_CLIP_PATHS.open.left
        },
        ...buildRevealSideGeometry({
          side: "left",
          scale,
          geometry,
          tierGeometry,
          panelLeft: leftPanelLeft,
          groupWidth: leftGroupWidth + edgeOverscanPx,
          viewportHeight: safeViewportHeight
        })
      },
      right: {
        group: {
          left: viewportCenterX - seamGapPx,
          width: rightGroupWidth + edgeOverscanPx,
          transformOrigin: "0% 50%",
          clipPathClosed: REVEAL_GROUP_CLIP_PATHS.closed.right,
          clipPathOpen: REVEAL_GROUP_CLIP_PATHS.open.right
        },
        ...buildRevealSideGeometry({
          side: "right",
          scale,
          geometry,
          tierGeometry,
          panelLeft: rightPanelLeft,
          groupWidth: rightGroupWidth + edgeOverscanPx,
          viewportHeight: safeViewportHeight
        })
      }
    },
    progress: {
      width: progress.width * scale,
      bottom: progress.bottom * scale
    },
    logo: {
      width: logo.width * scale,
      top: logo.top * scale
    },
    fractureClip: geometry.fractureClip
  };
}

export const motionConfig = {
  loader: {
    debugState: null,
    timingsMs: {
      initialHold: 360,
      loaderFill: 1240,
      loaderCompleteHold: 560,
      loaderFade: 200,
      startToMid: 1880,
      midHold: 260,
      midToEnd: 3340
    },
    easing: {
      loaderFade: "cubic-bezier(0.23, 1, 0.32, 1)",
      startToMid: "cubic-bezier(0.77, 0, 0.175, 1)",
      midHold: "linear",
      midToEnd: "cubic-bezier(0.23, 1, 0.32, 1)"
    },
    underlay: {
      start: "inset(0 50% 0 50%)",
      release: "inset(0 48.8% 0 48.8%)",
      mid: "inset(0 42.6% 0 42.6%)",
      end: "inset(0 0% 0 0%)"
    },
    geometry: {
      designHeight: 1080,
      // Seam anchors are solved against the reveal door art so the world split
      // and the bean fracture stay visually seated together.
      leftAssetWidth: 1012,
      rightAssetWidth: 986,
      leftSeamAnchorX: 914,
      rightSeamAnchorX: 72,
      fractureClip: {
        left:
          "polygon(0% 0%, 58% 0%, 56.5% 4%, 54.5% 8%, 52.8% 15%, 51.8% 23%, 52.6% 34%, 50.5% 44%, 51.6% 56%, 49.6% 68%, 51.2% 80%, 53.5% 91%, 56.5% 97%, 58.5% 100%, 0% 100%)",
        right:
          "polygon(100% 0%, 42% 0%, 43.5% 4%, 45.5% 8%, 47.2% 15%, 48.2% 23%, 47.4% 34%, 49.5% 44%, 48.4% 56%, 50.4% 68%, 48.8% 80%, 46.5% 91%, 43.5% 97%, 41.5% 100%, 100% 100%)"
      },
      logo: {
        width: 80,
        top: 84
      },
      progress: {
        width: 470,
        bottom: 270
      },
      sides: {
        left: {
          bean: {
            left: 768,
            top: 344,
            width: 298,
            height: 334
          },
          shadow: {
            left: -126,
            bottom: -52,
            width: 566,
            height: 318
          },
          fragments: [
            { left: 918, top: 468, width: 56, height: 80 },
            { left: 904, top: 486, width: 72, height: 68 },
            { left: 896, top: 510, width: 96, height: 92 },
            { left: 912, top: 548, width: 50, height: 58 }
          ]
        },
        right: {
          bean: {
            left: -73,
            top: 344,
            width: 298,
            height: 334
          },
          shadow: {
            right: -92,
            top: -58,
            width: 624,
            height: 370
          },
          fragments: [
            { left: 18, top: 470, width: 60, height: 78 },
            { left: 22, top: 486, width: 76, height: 68 },
            { left: 14, top: 502, width: 100, height: 72 },
            { left: 8, top: 452, width: 96, height: 140 }
          ]
        }
      },
      tiers: {
        desktop: {
          edgeOverscanPx: 320,
          startSeamGapPx: 0
        },
        compact: {
          edgeOverscanPx: 272,
          startSeamGapPx: 0,
          logo: {
            width: 78,
            top: 78
          },
          progress: {
            width: 420,
            bottom: 316
          }
        },
        mobile: {
          edgeOverscanPx: 226,
          startSeamGapPx: 0,
          logo: {
            width: 74,
            top: 80
          },
          progress: {
            width: 356,
            bottom: 308
          },
          sides: {
            left: {
              bean: {
                left: 774,
                top: 358,
                width: 276,
                height: 310
              },
              shadow: {
                left: -76,
                bottom: -26,
                width: 420,
                height: 246
              }
            },
            right: {
              bean: {
                left: -66,
                top: 358,
                width: 276,
                height: 310
              },
              shadow: {
                right: -52,
                top: -34,
                width: 476,
                height: 286
              }
            }
          }
        }
      }
    },
    fragments: {
      desktop: {
        start: [
          { x: -3, y: 4, rotation: -3, scale: 0.66, opacity: 0.01 },
          { x: -1, y: 3, rotation: 4, scale: 0.62, opacity: 0.01 },
          { x: -4, y: 0, rotation: -6, scale: 0.68, opacity: 0.01 },
          { x: -1, y: 2, rotation: 4, scale: 0.6, opacity: 0.01 }
        ],
        release: {
          left: [
            { x: -52, y: -28, rotation: -8, scale: 0.9, opacity: 0.28 },
            { x: -76, y: 2, rotation: -18, scale: 0.84, opacity: 0.26 },
            { x: -58, y: 34, rotation: 12, scale: 0.88, opacity: 0.24 },
            { x: -74, y: 74, rotation: -14, scale: 0.8, opacity: 0.2 }
          ],
          right: [
            { x: 52, y: -28, rotation: 8, scale: 0.9, opacity: 0.28 },
            { x: 76, y: 2, rotation: -12, scale: 0.86, opacity: 0.26 },
            { x: 58, y: 32, rotation: -16, scale: 0.86, opacity: 0.24 },
            { x: 74, y: 72, rotation: -8, scale: 0.84, opacity: 0.2 }
          ]
        },
        mid: {
          left: [
            { x: -162, y: -112, rotation: -18, scale: 0.96, opacity: 0.78 },
            { x: -248, y: -6, rotation: -46, scale: 0.9, opacity: 0.72 },
            { x: -188, y: 96, rotation: 20, scale: 0.94, opacity: 0.74 },
            { x: -228, y: 196, rotation: -24, scale: 0.86, opacity: 0.64 }
          ],
          right: [
            { x: 162, y: -112, rotation: 18, scale: 0.96, opacity: 0.78 },
            { x: 248, y: -6, rotation: -18, scale: 0.92, opacity: 0.72 },
            { x: 188, y: 94, rotation: -26, scale: 0.9, opacity: 0.72 },
            { x: 228, y: 198, rotation: -16, scale: 0.92, opacity: 0.64 }
          ]
        },
        hold: {
          left: [
            { x: -186, y: -126, rotation: -20, scale: 0.98, opacity: 0.8 },
            { x: -272, y: -10, rotation: -50, scale: 0.92, opacity: 0.74 },
            { x: -206, y: 108, rotation: 22, scale: 0.96, opacity: 0.76 },
            { x: -248, y: 222, rotation: -26, scale: 0.88, opacity: 0.66 }
          ],
          right: [
            { x: 186, y: -124, rotation: 20, scale: 0.98, opacity: 0.8 },
            { x: 272, y: -6, rotation: -20, scale: 0.94, opacity: 0.74 },
            { x: 206, y: 110, rotation: -30, scale: 0.92, opacity: 0.74 },
            { x: 248, y: 224, rotation: -18, scale: 0.94, opacity: 0.66 }
          ]
        },
        end: {
          left: [
            { x: -404, y: -236, rotation: -38, scale: 1.08, opacity: 0.84 },
            { x: -518, y: -34, rotation: -94, scale: 0.98, opacity: 0.74 },
            { x: -394, y: 188, rotation: 48, scale: 1.06, opacity: 0.8 },
            { x: -432, y: 362, rotation: -44, scale: 0.96, opacity: 0.68 }
          ],
          right: [
            { x: 404, y: -228, rotation: 36, scale: 1.08, opacity: 0.82 },
            { x: 516, y: -22, rotation: -36, scale: 1, opacity: 0.74 },
            { x: 392, y: 192, rotation: -52, scale: 0.98, opacity: 0.7 },
            { x: 428, y: 366, rotation: -30, scale: 1.04, opacity: 0.66 }
          ]
        }
      }
    },
    shadows: {
      start: {
        left: { opacity: 0.14, scale: 1, xPercent: 0, yPercent: 0 },
        right: { opacity: 0.132, scale: 1, xPercent: 0, yPercent: 0 }
      },
      mid: {
        left: { opacity: 0.16, scale: 1.05, xPercent: -2.6, yPercent: 2.6 },
        right: { opacity: 0.152, scale: 1.05, xPercent: 2.6, yPercent: -2.2 }
      },
      end: {
        left: { opacity: 0.01, scale: 1.18, xPercent: -12, yPercent: 12 },
        right: { opacity: 0.01, scale: 1.18, xPercent: 12, yPercent: -10 }
      }
    },
    groups: {
      desktop: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -124, xPercent: 0, yPercent: 0.2, scale: 1.14, opacity: 1 },
          right: { x: 124, xPercent: 0, yPercent: 0.2, scale: 1.14, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.76, xPercent: 0, yPercent: -1.8, scale: 4.18, opacity: 1 },
          right: { xViewport: 1.76, xPercent: 0, yPercent: -1.8, scale: 4.18, opacity: 1 }
        }
      },
      compact: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -104, xPercent: 0, yPercent: 0.2, scale: 1.12, opacity: 1 },
          right: { x: 104, xPercent: 0, yPercent: 0.2, scale: 1.12, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.64, xPercent: 0, yPercent: -1.4, scale: 3.76, opacity: 1 },
          right: { xViewport: 1.64, xPercent: 0, yPercent: -1.4, scale: 3.76, opacity: 1 }
        }
      },
      mobile: {
        start: {
          left: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
          right: { x: 0, xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }
        },
        mid: {
          left: { x: -82, xPercent: 0, yPercent: 0.1, scale: 1.1, opacity: 1 },
          right: { x: 82, xPercent: 0, yPercent: 0.1, scale: 1.1, opacity: 1 }
        },
        end: {
          left: { xViewport: -1.48, xPercent: 0, yPercent: -0.8, scale: 3.26, opacity: 1 },
          right: { xViewport: 1.48, xPercent: 0, yPercent: -0.8, scale: 3.26, opacity: 1 }
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

export { REVEAL_SIDES };
