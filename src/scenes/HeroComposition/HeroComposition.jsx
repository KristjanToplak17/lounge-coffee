import React from "react";
import { heroCopy, heroNavigation, heroUtilities } from "../../content/copy";
import { heroMetrics } from "../../content/metrics";
import { assetMap } from "../../utils/assetMap";
import "./HeroComposition.css";

const heroCups = [
  {
    key: "red",
    alt: "Red Lounge Coffee cup",
    className: "hero-composition__cup hero-composition__cup--red",
    src: assetMap.cups.red
  },
  {
    key: "yellow",
    alt: "Yellow Lounge Coffee cup",
    className: "hero-composition__cup hero-composition__cup--yellow",
    src: assetMap.cups.yellow
  },
  {
    key: "black",
    alt: "Black Lounge Coffee cup",
    className: "hero-composition__cup hero-composition__cup--black",
    src: assetMap.cups.black
  },
  {
    key: "orange",
    alt: "Orange Lounge Coffee cup",
    className: "hero-composition__cup hero-composition__cup--orange",
    src: assetMap.cups.orange
  }
];

function BasketIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hero-composition__utility-icon"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.75 7.25H14.25L13.75 16H6.25L5.75 7.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 8.25V5.75C7.25 4.23122 8.48122 3 10 3C11.5188 3 12.75 4.23122 12.75 5.75V8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CaretIcon() {
  return (
    <svg
      aria-hidden="true"
      className="hero-composition__caret-icon"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroComposition() {
  return (
    <section
      className="hero-composition"
      aria-label="Lounge Coffee hero"
      data-scene="hero"
    >
      <div className="hero-composition__atmosphere hero-composition__atmosphere--left" aria-hidden="true" />
      <div className="hero-composition__atmosphere hero-composition__atmosphere--center" aria-hidden="true" />
      <div className="hero-composition__atmosphere hero-composition__atmosphere--right" aria-hidden="true" />

      <div className="hero-composition__chrome">
        <div className="hero-composition__content-frame">
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

      <div className="hero-composition__scene">
        <div className="hero-composition__content-frame hero-composition__scene-frame">
          <div className="hero-composition__artboard">
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

            <div className="hero-composition__copy">
              <img
                className="hero-composition__sticker"
                src={assetMap.stickers.mascot}
                alt={heroCopy.eyebrowAlt}
              />

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

            <div className="hero-composition__cup-stage" aria-hidden="true">
              {heroCups.map((cup) => (
                <img key={cup.key} className={cup.className} src={cup.src} alt={cup.alt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
