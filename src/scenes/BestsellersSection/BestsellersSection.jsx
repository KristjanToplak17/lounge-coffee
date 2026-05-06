import React from "react";
import { bestsellersCopy, bestsellersProducts } from "../../content/bestsellers";
import "./BestsellersSection.css";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="bestsellers-section__button-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BestsellersSection() {
  return (
    <section
      className="bestsellers-section"
      data-scene="bestsellers"
      aria-labelledby="bestsellers-title"
    >
      <div className="bestsellers-section__frame">
        <div className="bestsellers-section__heading-block">
          <h2 id="bestsellers-title" className="bestsellers-section__title">
            {bestsellersCopy.title}
          </h2>
          <p className="bestsellers-section__subtitle">{bestsellersCopy.subtitle}</p>
          <p className="bestsellers-section__background-word" aria-hidden="true">
            BESTSELLERS
          </p>
        </div>

        <div className="bestsellers-section__grid" role="list" aria-label="Best-selling Lounge favorites">
          {bestsellersProducts.map((product) => (
            <article
              key={product.key}
              className={`bestsellers-section__card bestsellers-section__card--${product.key}${product.featured ? " bestsellers-section__card--featured" : ""}`}
              role="listitem"
            >
              {product.featured ? (
                <div className="bestsellers-section__badge" aria-label="Best seller">
                  <span className="bestsellers-section__badge-star" aria-hidden="true">
                    ★
                  </span>
                  <span>Best Seller</span>
                </div>
              ) : null}

              <div className="bestsellers-section__image-stage">
                <img
                  className="bestsellers-section__packet"
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  loading="lazy"
                />
              </div>

              <div className="bestsellers-section__copy">
                <h3 className="bestsellers-section__product-name">{product.name}</h3>
                <p className="bestsellers-section__product-description">{product.description}</p>
              </div>

              <div className="bestsellers-section__action-row">
                <button
                  className={`bestsellers-section__button${product.featured ? " bestsellers-section__button--featured" : ""}`}
                  type="button"
                >
                  <span>{bestsellersCopy.ctaLabel}</span>
                  <ArrowIcon />
                </button>

                <div className="bestsellers-section__price-block">
                  <p className="bestsellers-section__price">{product.price}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
