import React from "react";
import { menuCategories, menuSectionCopy } from "../../content/menu";
import { menuImageMap, menuStickerIcon } from "./menuAssets";
import "./MenuSection.css";

function MenuSectionHeading() {
  return (
    <div className="menu-section__hero">
      <div className="menu-section__title-block">
        <h2 className="menu-section__title" id="menu-section-title">
          {menuSectionCopy.title.map((line) => (
            <span key={line} className="menu-section__title-line">
              {line}
            </span>
          ))}
        </h2>
      </div>

      <img
        className="menu-section__sticker"
        src={menuStickerIcon}
        alt={menuSectionCopy.iconAlt}
        loading="lazy"
      />
    </div>
  );
}

function MenuSubsectionHeader({ label }) {
  return (
    <div className="menu-section__subsection-header">
      <h4 className="menu-section__subsection-label">{label}</h4>
      <span className="menu-section__subsection-rule" aria-hidden="true" />
    </div>
  );
}

function MenuProductItem({ item, variant }) {
  return (
     <article
      className={`menu-section__product-item menu-section__product-item--${variant} menu-section__product-item--${item.key}`}
    >
      <div className={`menu-section__product-image-stage menu-section__product-image-stage--${variant}`}>
        <img
           className={`menu-section__product-image menu-section__product-image--${variant} menu-section__product-image--${item.key}`}
          src={menuImageMap[item.key]}
          alt={item.name}
          loading="lazy"
        />
      </div>

      <div className="menu-section__product-meta">
        <h5 className="menu-section__product-name">{item.name}</h5>
        <p className="menu-section__product-price">{item.price}</p>
      </div>
    </article>
  );
}

function MenuProductGrid({ items, variant }) {
  return (
    <div className={`menu-section__product-grid menu-section__product-grid--${variant}`} role="list">
      {items.map((item) => (
        <div key={item.key} role="listitem">
          <MenuProductItem item={item} variant={variant} />
        </div>
      ))}
    </div>
  );
}

function MenuTextListItem({ item }) {
  return (
    <div className="menu-section__text-list-row">
      <span className="menu-section__text-list-name">{item.name}</span>
      <span className="menu-section__text-list-price">{item.price}</span>
    </div>
  );
}

function MenuTextList({ column }) {
  return (
    <section className="menu-section__text-column menu-section__text-column--list">
      <MenuSubsectionHeader label={column.label} />

      <div className="menu-section__text-list" role="list">
        {column.items.map((item) => (
          <div key={item.name} role="listitem">
            <MenuTextListItem item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

function MenuSubsection({ section }) {
  if (section.type === "list-grid") {
    return (
      <div className="menu-section__list-grid">
        {section.columns.map((column) => (
          <MenuTextList key={column.key} column={column} />
        ))}
      </div>
    );
  }

  return (
    <section className={`menu-section__subsection menu-section__subsection--${section.key}`}>
      <MenuSubsectionHeader label={section.label} />
      <MenuProductGrid
        items={section.items}
        variant={section.key === "donuts" || section.key === "croissants" ? "pastry" : "drink"}
      />
    </section>
  );
}

function MenuCategory({ category }) {
  return (
    <section className="menu-section__category" aria-labelledby={`menu-category-${category.key}`}>
      <h3 className="menu-section__category-title" id={`menu-category-${category.key}`}>
        {category.title}
      </h3>

      <div className="menu-section__category-stack">
        {category.sections.map((section) => (
          <MenuSubsection key={section.key} section={section} />
        ))}
      </div>
    </section>
  );
}

export function MenuSection() {
  return (
    <section
      className="menu-section"
      data-scene="menu"
      aria-labelledby="menu-section-title"
    >
      <div className="menu-section__section-break" aria-hidden="true" />

      <div className="menu-section__frame">
        <MenuSectionHeading />

        <div className="menu-section__categories">
          {menuCategories.map((category) => (
            <MenuCategory key={category.key} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
