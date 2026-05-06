import { assetMap } from "../utils/assetMap";

export const bestsellersCopy = {
  title: "Best-selling Lounge Favorites",
  subtitle: "Our top picks, loved by thousands. Rich flavors, crafted to perfection.",
  ctaLabel: "Add to Basket"
};

export const bestsellersProducts = [
  {
    key: "cherry-mocha",
    name: "Cherry Mocha",
    description: "Bold, smooth & perfectly sweet.",
    price: "$10.99",
    imageAlt: "Cherry Mocha Lounge Coffee packet",
    imageSrc: assetMap.packets.cherryMocha
  },
  {
    key: "citrus-burst",
    name: "Citrus Burst",
    description: "Zesty, bright & refreshingly bold.",
    price: "$10.99",
    imageAlt: "Citrus Burst Lounge Coffee packet",
    imageSrc: assetMap.packets.citrusBurst,
    featured: true
  },
  {
    key: "honey-oat",
    name: "Honey Oat",
    description: "Smooth, cozy & naturally sweet.",
    price: "$11.99",
    imageAlt: "Honey Oat Lounge Coffee packet",
    imageSrc: assetMap.packets.honeyOat
  }
];
