import beanFragment1 from "../../assets/beanFragments/beanFragment-1.webp";
import beanFragment2 from "../../assets/beanFragments/beanFragment-2.webp";
import beanFragment3 from "../../assets/beanFragments/beanFragment-3.webp";
import beanFragment4 from "../../assets/beanFragments/beanFragment-4.webp";
import beanFragment5 from "../../assets/beanFragments/beanFragment-5.webp";
import beanFragment6 from "../../assets/beanFragments/beanFragment-6.webp";
import beanFragment7 from "../../assets/beanFragments/beanFragment-7.webp";
import beanFragment8 from "../../assets/beanFragments/beanFragment-8.webp";
import coffeeCupBlack from "../../assets/coffeeCups/coffeeCup-black.webp";
import coffeeCupOrange from "../../assets/coffeeCups/coffeeCup-orange.webp";
import coffeeCupRed from "../../assets/coffeeCups/coffeeCup-red.webp";
import coffeeCupYellow from "../../assets/coffeeCups/coffeeCup-yellow.webp";
import logoDark from "../../assets/logo/logo-dark-ui.webp";
import logoLight from "../../assets/logo/logo-white-ui.webp";
import shadowCoffeeLeaf from "../../assets/shadows/shadow-coffeeLeaf.webp";
import stickerCoffeePot from "../../assets/stickers/sticker-coffeePot-section.webp";
import stickerMascot from "../../assets/stickers/sticker-mascot-ui.webp";
import maskedCroissant from "../../assets/supportingImages/masked-croissant-pill.webp";
import maskedCupOfCoffee from "../../assets/supportingImages/masked-cupOfCoffee-pill.webp";

export const assetMap = {
  logos: {
    dark: logoDark,
    light: logoLight
  },
  beanFragments: {
    left: [beanFragment6, beanFragment1, beanFragment2, beanFragment3],
    right: [beanFragment7, beanFragment8, beanFragment4, beanFragment5]
  },
  shadows: {
    coffeeLeaf: shadowCoffeeLeaf
  },
  stickers: {
    coffeePot: stickerCoffeePot,
    mascot: stickerMascot
  },
  supportingImages: {
    croissant: maskedCroissant,
    cupOfCoffee: maskedCupOfCoffee
  },
  cups: {
    black: coffeeCupBlack,
    orange: coffeeCupOrange,
    red: coffeeCupRed,
    yellow: coffeeCupYellow
  }
};
