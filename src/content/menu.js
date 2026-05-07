export const menuSectionCopy = {
  title: ["Our", "Fresh Menu."],
  iconAlt: "Locally roasted menu badge"
};

export const menuCategories = [
  {
    key: "drinks",
    title: "Drinks",
    sections: [
      {
        key: "signature-coffee",
        label: "Signature Coffee",
        type: "grid",
        items: [
          { key: "chocoLatte", name: "Choco Latte", price: "$5.70" },
          { key: "matchaCloud", name: "Matcha Cloud", price: "$6.20" },
          { key: "taroSwirl", name: "Taro Swirl", price: "$6.10" },
          { key: "vanillaCream", name: "Vanilla Cream", price: "$5.80" }
        ]
      },
      {
        key: "fresh-cold",
        label: "Fresh Cold",
        type: "grid",
        items: [
          { key: "berrySplash", name: "Berry Splash", price: "$4.90" },
          { key: "citrusSpark", name: "Citrus Spark", price: "$4.70" },
          { key: "mintLime", name: "Mint Lime", price: "$4.60" },
          { key: "peachBreeze", name: "Peach Breeze", price: "$4.80" }
        ]
      },
      {
        key: "milk-based-cold",
        label: "Milk-Based Cold",
        type: "grid",
        items: [
          { key: "brownSugar", name: "Brown Sugar", price: "$5.90" },
          { key: "pecansLatte", name: "Pecans Latte", price: "$5.80" },
          { key: "honeyOat", name: "Honey Oat", price: "$5.70" },
          { key: "ubeCream", name: "Ube Cream", price: "$6.10" }
        ]
      },
      {
        key: "drinks-lists",
        type: "list-grid",
        columns: [
          {
            key: "arabica",
            label: "Arabica",
            items: [
              { name: "Espresso", price: "$2.80" },
              { name: "Americano", price: "$3.40" },
              { name: "Cold Brew", price: "$4.60" },
              { name: "Cortado", price: "$3.90" },
              { name: "Manual Brew", price: "$4.50" }
            ]
          },
          {
            key: "coffee",
            label: "Coffee",
            items: [
              { name: "Salted Caramel", price: "$5.70" },
              { name: "Avocado Latte", price: "$6.30" },
              { name: "Vanilla Latte", price: "$5.40" },
              { name: "Pumpkin Spice", price: "$5.80" },
              { name: "Oat Milk Latte", price: "$5.90" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "pastries",
    title: "Pastries",
    sections: [
      {
        key: "donuts",
        label: "Donuts",
        type: "grid",
        items: [
          { key: "caramelDonut", name: "Caramel", price: "$3.50" },
          { key: "chocolateDonut", name: "Chocolate", price: "$3.50" },
          { key: "cookiesDonut", name: "Cookies", price: "$3.50" },
          { key: "strawberryDonut", name: "Strawberry", price: "$3.50" }
        ]
      },
      {
        key: "croissants",
        label: "Croissants",
        type: "grid",
        items: [
          { key: "berryCroissant", name: "Berry", price: "$3.20" },
          { key: "chocolateCroissant", name: "Chocolate", price: "$3.20" },
          { key: "pistachioCroissant", name: "Pistachio", price: "$3.20" },
          { key: "vanillaCroissant", name: "Vanilla", price: "$3.20" }
        ]
      }
    ]
  }
];
