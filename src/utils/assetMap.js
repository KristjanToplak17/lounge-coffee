import beanFragment1 from "../../assets/beanFragments/beanFragment-1.webp";
import beanFragment2 from "../../assets/beanFragments/beanFragment-2.webp";
import beanFragment3 from "../../assets/beanFragments/beanFragment-3.webp";
import beanFragment4 from "../../assets/beanFragments/beanFragment-4.webp";
import beanFragment5 from "../../assets/beanFragments/beanFragment-5.webp";
import beanFragment6 from "../../assets/beanFragments/beanFragment-6.webp";
import beanFragment7 from "../../assets/beanFragments/beanFragment-7.webp";
import beanFragment8 from "../../assets/beanFragments/beanFragment-8.webp";
import coffeeBeanFull from "../../assets/coffeeBean/coffeeBean-full.webp";
import coffeeCupBlack from "../../assets/coffeeCups/coffeeCup-black.webp";
import coffeeCupOrange from "../../assets/coffeeCups/coffeeCup-orange.webp";
import coffeeCupRed from "../../assets/coffeeCups/coffeeCup-red.webp";
import coffeeCupYellow from "../../assets/coffeeCups/coffeeCup-yellow.webp";
import logoDark from "../../assets/logo/logo-dark.webp";
import logoLight from "../../assets/logo/logo-white.webp";
import revealPanelLeft from "../../assets/revealBackground/left-reveal-baked.png";
import revealPanelRight from "../../assets/revealBackground/right-reveal-baked.png";
import shadowCoffeeLeaf from "../../assets/shadows/shadow-coffeeLeaf.webp";
import stickerMascot from "../../assets/stickers/sticker-mascot.webp";

export const assetMap = {
  logos: {
    dark: logoDark,
    light: logoLight
  },
  revealPanels: {
    left: revealPanelLeft,
    right: revealPanelRight
  },
  beans: {
    full: coffeeBeanFull
  },
  beanFragments: {
    left: [beanFragment6, beanFragment1, beanFragment2, beanFragment3],
    right: [beanFragment7, beanFragment8, beanFragment4, beanFragment5]
  },
  shadows: {
    coffeeLeaf: shadowCoffeeLeaf
  },
  stickers: {
    mascot: stickerMascot
  },
  cups: {
    black: coffeeCupBlack,
    orange: coffeeCupOrange,
    red: coffeeCupRed,
    yellow: coffeeCupYellow
  }
};
