const TRANSITION_ACTIVE_THRESHOLD = 0.001;
const SETTLED_CUP_THRESHOLD = 0.999;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

export function measureElementRect(element) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  if (!rect.width || !rect.height) {
    return null;
  }

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
}

export function buildCupTransitionMetrics(sourceRect, targetRect) {
  if (!sourceRect || !targetRect) {
    return null;
  }

  return {
    sourceRect,
    targetRect,
    scale: targetRect.width / sourceRect.width,
    translateX: targetRect.left - sourceRect.left,
    translateY: targetRect.top - sourceRect.top
  };
}

export function getHeroCupVisible(progress) {
  return progress <= TRANSITION_ACTIVE_THRESHOLD;
}

export function getSettledCupOpacity(progress) {
  return progress >= SETTLED_CUP_THRESHOLD ? 1 : 0;
}

export function getTransitionCupOpacity(progress) {
  return progress > TRANSITION_ACTIVE_THRESHOLD && progress < SETTLED_CUP_THRESHOLD ? 1 : 0;
}
