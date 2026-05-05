const HERO_CUP_FADE_THRESHOLD = 0.012;
const TRANSITION_CUP_FADE_START = 0.018;
const TRANSITION_CUP_FADE_END = 0.05;
const SETTLED_CUP_FADE_START = 0.985;
const SETTLED_CUP_FADE_END = 0.998;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

export function mapProgress(value, start, end) {
  if (end <= start) {
    return value >= end ? 1 : 0;
  }

  return clamp((value - start) / (end - start), 0, 1);
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
  return progress < HERO_CUP_FADE_THRESHOLD;
}

export function getSettledCupOpacity(progress) {
  return mapProgress(progress, SETTLED_CUP_FADE_START, SETTLED_CUP_FADE_END);
}

export function getTransitionCupOpacity(progress) {
  return mapProgress(progress, TRANSITION_CUP_FADE_START, TRANSITION_CUP_FADE_END);
}
