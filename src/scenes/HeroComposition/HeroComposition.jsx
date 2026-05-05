import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react";
import { gsap } from "gsap";
import { heroCompositionTimeline } from "../../animations/heroCompositionTimeline";
import { heroCopy, heroNavigation, heroUtilities } from "../../content/copy";
import { heroMetrics } from "../../content/metrics";
import { assetMap } from "../../utils/assetMap";
import "./HeroComposition.css";

const heroCups = [
  {
    key: "red",
    alt: "Red Lounge Coffee cup",
    motionClassName: "hero-composition__cup-motion hero-composition__cup-motion--red",
    imageClassName: "hero-composition__cup hero-composition__cup--red",
    src: assetMap.cups.red
  },
  {
    key: "yellow",
    alt: "Yellow Lounge Coffee cup",
    motionClassName: "hero-composition__cup-motion hero-composition__cup-motion--yellow",
    imageClassName: "hero-composition__cup hero-composition__cup--yellow",
    src: assetMap.cups.yellow
  },
  {
    key: "black",
    alt: "Black Lounge Coffee cup",
    motionClassName: "hero-composition__cup-motion hero-composition__cup-motion--black",
    imageClassName: "hero-composition__cup hero-composition__cup--black",
    src: assetMap.cups.black
  },
  {
    key: "orange",
    alt: "Orange Lounge Coffee cup",
    motionClassName: "hero-composition__cup-motion hero-composition__cup-motion--orange",
    imageClassName: "hero-composition__cup hero-composition__cup--orange",
    src: assetMap.cups.orange
  }
];

function BasketIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hero-composition__utility-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m5 11 4-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m19 11-4-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 11h20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m3.5 11 1.6 7.4A2 2 0 0 0 7.1 20h9.8a2 2 0 0 0 2-1.6l1.7-7.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 11 1 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m15 11-1 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CaretIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hero-composition__caret-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const HeroComposition = forwardRef(function HeroComposition(
  { reducedMotion = false },
  ref
) {
  const rootRef = useRef(null);
  const chromeMotionRef = useRef(null);
  const statsMotionRef = useRef(null);
  const copyMotionRef = useRef(null);
  const stickerMotionRef = useRef(null);
  const redCupMotionRef = useRef(null);
  const yellowCupMotionRef = useRef(null);
  const blackCupMotionRef = useRef(null);
  const orangeCupMotionRef = useRef(null);
  const redCupShadowRef = useRef(null);
  const yellowCupShadowRef = useRef(null);
  const blackCupShadowRef = useRef(null);
  const orangeCupShadowRef = useRef(null);
  const revealTimelineRef = useRef(null);
  const revealStartedRef = useRef(false);
  const revealSettledRef = useRef(reducedMotion);
  const blackCupTransitionVisibleRef = useRef(true);

  useLayoutEffect(() => {
    revealSettledRef.current = reducedMotion;
    blackCupTransitionVisibleRef.current = true;

    const ctx = gsap.context(() => {
      revealTimelineRef.current = heroCompositionTimeline({
        reducedMotion,
        onComplete: () => {
          revealSettledRef.current = true;
        },
        elements: {
          chrome: chromeMotionRef.current,
          stats: statsMotionRef.current,
          copy: copyMotionRef.current,
          sticker: stickerMotionRef.current,
          redCup: redCupMotionRef.current,
          yellowCup: yellowCupMotionRef.current,
          blackCup: blackCupMotionRef.current,
          orangeCup: orangeCupMotionRef.current,
          redCupShadow: redCupShadowRef.current,
          yellowCupShadow: yellowCupShadowRef.current,
          blackCupShadow: blackCupShadowRef.current,
          orangeCupShadow: orangeCupShadowRef.current
        }
      });
    }, rootRef);

    return () => {
      revealTimelineRef.current = null;
      revealStartedRef.current = false;
      revealSettledRef.current = reducedMotion;
      blackCupTransitionVisibleRef.current = true;
      ctx.revert();
    };
  }, [reducedMotion]);

  useImperativeHandle(
    ref,
    () => ({
      playReveal() {
        if (revealStartedRef.current) {
          return;
        }

        revealSettledRef.current = false;
        revealStartedRef.current = true;
        revealTimelineRef.current?.play(0);
      },
      getBlackCupSourceMetrics() {
        const element = blackCupMotionRef.current;

        if (!element) {
          return null;
        }

        const rect = element.getBoundingClientRect();

        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        };
      },
      isRevealSettled() {
        return revealSettledRef.current;
      },
      setBlackCupTransitionVisibility(isVisible) {
        const element = blackCupMotionRef.current;

        if (!element || blackCupTransitionVisibleRef.current === isVisible) {
          return;
        }

        blackCupTransitionVisibleRef.current = isVisible;
        gsap.set(element, { opacity: isVisible ? 1 : 0 });
      }
    }),
    []
  );

  return (
    <section
      ref={rootRef}
      className="hero-composition"
      aria-label="Lounge Coffee hero"
      data-scene="hero"
    >
      <div className="hero-composition__atmosphere hero-composition__atmosphere--far-left" aria-hidden="true" />
      <div className="hero-composition__atmosphere hero-composition__atmosphere--left" aria-hidden="true" />
      <div className="hero-composition__atmosphere hero-composition__atmosphere--center" aria-hidden="true" />

      <div className="hero-composition__chrome-motion">
        <div className="hero-composition__chrome">
          <div ref={chromeMotionRef} className="hero-composition__content-frame">
            <header className="hero-composition__header">
              <a className="hero-composition__logo-link" href="#" aria-label="Lounge Coffee home">
                <img
                  className="hero-composition__logo"
                  src={assetMap.logos.dark}
                  alt="Lounge Coffee"
                />
              </a>

              <nav className="hero-composition__nav" aria-label="Primary navigation">
                {heroNavigation.map((item) => (
                  <a key={item} className="hero-composition__nav-link" href="#">
                    {item}
                  </a>
                ))}
              </nav>

              <div className="hero-composition__utilities" aria-label="Utility actions">
                <button className="hero-composition__utility" type="button">
                  <span>{heroUtilities.locale}</span>
                  <CaretIcon />
                </button>
                <button className="hero-composition__utility" type="button">
                  <span>{heroUtilities.basket}</span>
                  <BasketIcon />
                </button>
              </div>
            </header>
          </div>
        </div>
      </div>

      <div className="hero-composition__scene">
        <div className="hero-composition__content-frame hero-composition__scene-frame">
          <div className="hero-composition__artboard">
            <div ref={statsMotionRef} className="hero-composition__stats-motion">
              <div className="hero-composition__stats" aria-label="Brand proof">
                {heroMetrics.map((metric, index) => (
                  <div key={metric.label} className="hero-composition__stat">
                    <span className="hero-composition__stat-value">{metric.value}</span>
                    <span className="hero-composition__stat-label">{metric.label}</span>
                    {index < heroMetrics.length - 1 ? (
                      <span className="hero-composition__stat-separator" aria-hidden="true" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-composition__copy">
              <div ref={stickerMotionRef} className="hero-composition__sticker-motion">
                <img
                  className="hero-composition__sticker"
                  src={assetMap.stickers.mascot}
                  alt={heroCopy.eyebrowAlt}
                />
              </div>

              <div ref={copyMotionRef} className="hero-composition__copy-motion">
                <h1 className="hero-composition__headline">
                  {heroCopy.headline.map((line) => (
                    <span key={line} className="hero-composition__headline-line">
                      {line}
                    </span>
                  ))}
                </h1>

                <button className="hero-composition__cta" type="button">
                  {heroCopy.ctaLabel}
                </button>
              </div>
            </div>

            <div className="hero-composition__cup-stage" aria-hidden="true">
              {heroCups.map((cup) => (
                <div
                  key={cup.key}
                  ref={
                    cup.key === "red"
                      ? redCupMotionRef
                      : cup.key === "yellow"
                        ? yellowCupMotionRef
                        : cup.key === "black"
                          ? blackCupMotionRef
                          : orangeCupMotionRef
                  }
                  className={cup.motionClassName}
                >
                  <div
                    ref={
                      cup.key === "red"
                        ? redCupShadowRef
                        : cup.key === "yellow"
                          ? yellowCupShadowRef
                          : cup.key === "black"
                            ? blackCupShadowRef
                            : orangeCupShadowRef
                    }
                    className={`hero-composition__cup-ground-shadow hero-composition__cup-ground-shadow--${cup.key}`}
                  />
                  <img className={cup.imageClassName} src={cup.src} alt={cup.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
