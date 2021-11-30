import { ProductDetailsType } from "types/ProductDetailsType";
import { v4 as uuidv4 } from "uuid";

export const products: ProductDetailsType[] = [
  {
    tag: {
      slug: "p1",
    },
    brand: {
      id: uuidv4(),
      image:
        "https://firebasestorage.googleapis.com/v0/b/gucci-demo.appspot.com/o/logo-gucci.png?alt=media&token=fe7b6317-e65e-45c9-a30e-0fe809f9c809",
      name: "Gucci",
      social: {
        phone: "+15121231234",
        email: "sush@brij.it",
        twitter: "twitter.com/@sush",
        instagram: "instagram.com/@sush1",
        facebook: "facebook.com/Sushrutha",
      },
    },
    product: {
      id: uuidv4(),
      name: "Horsebit",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
      registered: true,
    },
    modules: {
      warranty: {
        id: uuidv4(),
        type: "warranty",
        activated: false,
        banner: "",
        heading: "Rest Easy",
        description:
          "This warranty protects your device for 1 year after purchase. Register below to activate your warranty.",
        warrantyStatus: {
          details:
            "Products purchased from an Authorized Retailer are fully warranted against defects in materials and workmanship for 2 years for the original owner. Register this product now to activate its warranty.",
          duration: "2 years",
          status: "Receipt Upload Required",
        },
      },
      sms: {
        id: uuidv4(),
        type: "sms",
        title: "Become a Canopy Club VIP",
        banner: "",
        details:
          "Register here for VIP access to Canopy Club. You’ll get members-only exclusive content and special offers via text.",
        sendSmsUri: "",
      },
    },
  },
  {
    tag: {
      slug: "p2",
    },
    brand: {
      id: uuidv4(),
      image:
        "https://firebasestorage.googleapis.com/v0/b/gucci-demo.appspot.com/o/logo-gucci.png?alt=media&token=fe7b6317-e65e-45c9-a30e-0fe809f9c809",
      name: "Gucci",
      social: {
        phone: "+15121231234",
        email: "sush@brij.it",
        twitter: "twitter.com/@sush",
        instagram: "instagram.com/@sush1",
        facebook: "facebook.com/Sushrutha",
      },
    },
    product: {
      id: uuidv4(),
      name: "Purse",
      image:
        "https://media.gucci.com/style/DarkGray_Center_0_0_1200x1200/1586365204/631685_96IWB_8745_001_100_0000_Light-Ophidia-GG-medium-tote.jpg",
      registered: false,
    },
    modules: {
      warranty: {
        id: uuidv4(),
        type: "warranty",
        activated: false,
        banner: "",
        heading: "Rest Easy",
        description:
          "This warranty protects your device for 1 year after purchase. Register below to activate your warranty.",
        warrantyStatus: {
          details:
            "Products purchased from an Authorized Retailer are fully warranted against defects in materials and workmanship for 2 years for the original owner. Register this product now to activate its warranty.",
          duration: "2 years",
          status: "Receipt Upload Required",
        },
      },
      sms: {
        id: uuidv4(),
        type: "sms",
        title: "Become a Canopy Club VIP",
        banner: "",
        details:
          "Register here for VIP access to Canopy Club. You’ll get members-only exclusive content and special offers via text.",
        sendSmsUri: "",
      },
    },
  },
  {
    tag: {
      slug: "p3",
    },
    brand: {
      id: uuidv4(),
      image:
        "https://firebasestorage.googleapis.com/v0/b/gucci-demo.appspot.com/o/logo-gucci.png?alt=media&token=fe7b6317-e65e-45c9-a30e-0fe809f9c809",
      name: "New Wave",
      social: {
        phone: "+15515532155",
        email: "sush@brij.it",
        twitter: "twitter.com/@sush",
        instagram: "instagram.com/@sush1",
        facebook: "facebook.com/Sushrutha",
      },
    },
    product: {
      id: uuidv4(),
      name: "New Wave",
      image:
        "https://cdn.shopify.com/s/files/1/0376/9922/3688/products/24406_CMPG.jpg?v=1631297543",
      registered: false,
    },
    modules: {
      info: {
        id: uuidv4(),
        type: "info",
        serialNumber: "XX9898 LVHB5 1000",
        description:
          "Designed with its original archetype in mind, the Sylvie 1969 unifies the details of its archival inspiration with a contemporary spirit. The structured top handle in textured black leather is defined by a narrow gold-toned metal chain fitted to the flap and body of the bag—a modern interpretation of the distinctive hardware. The silhouette is completed with a detachable and adjustable shoulder strap.",
        features: [
          "Black textured leather with a vintage effect",
          "Shiny gold-toned hardware",
          "Leather lining",
          "Metal chain and buckle closure",
          "Exterior back pocket",
          "One interior zipper and one interior open pocket",
          'Top handle with 4.3" drop',
          'Detachable and adjustable shoulder strap with 22" drop.',
          "Weight: .94kg approximately",
          'Small size: 10.2" W x 7.7"H x 3.3"D',
          "Made in Italy",
          'The model is 5.8" tall',
        ],
      },
      registration: {
        id: uuidv4(),
        type: "registration",
        title: "Register for 10% off",
        banner: "",
        heading: "Rest Easy",
        description:
          "This warranty protects your device for 1 year after purchase. Register below to activate your warranty.",
        nextLink: "/collection",
      },
      warranty: {
        id: uuidv4(),
        type: "warranty",
        activated: false,
        banner: "",
        heading: "Care Free",
        description:
          "This warranty can be claimed for up to one year. Register below to activate your warranty now.",
        warrantyStatus: {
          details:
            "Products purchased from an Authorized Retailer are fully warranted against defects in materials and workmanship for 1 year for the original owner. Register this product now to activate its warranty.",
          duration: "1 year",
          status: "Warranty Activated",
          purchaseDate: "March 29, 2021",
          expirationDate: "March 29, 2022",
        },
      },
      shop: {
        type: "shop",
        id: uuidv4(),
        title: "Buy with 15% off",
        shoppingVariantDetails: {
          allOptions: [
            {
              name: "Size",
              values: ["Small", "Large"],
            },
            {
              name: "Color",
              values: ["Camp Green", "Steller Blue", "Smolder Blue"],
            },
          ],
          productImage:
            "https://cdn.shopify.com/s/files/1/0376/9922/3688/products/24406_CMPG.jpg?v=1631297543",
          discount: 15,
          validVariantOptions: [
            {
              options: [
                {
                  name: "Size",
                  value: "Small",
                },
                {
                  name: "Color",
                  value: "Camp Green",
                },
              ],
              checkoutUri:
                "https://foundtags.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=39535843999880%26items[][quantity]=1%26return_to=/checkout",
              variantComparatorStr: "Small:Camp Green",
              image:
                "https://cdn.shopify.com/s/files/1/0376/9922/3688/products/24406_CMPG.jpg?v=1631297543",
              inventoryQuantity: 10,
              price: 229.0,
              availableForSale: true,
              objectHash: "be2833881507f2c13aa307c71b698f9cd70785c3",
            },
            {
              options: [
                {
                  name: "Size",
                  value: "Small",
                },
                {
                  name: "Color",
                  value: "Steller Blue",
                },
              ],
              checkoutUri:
                "https://foundtags.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=39535844032648%26items[][quantity]=1%26return_to=/checkout",
              variantComparatorStr: "Small:Steller Blue",
              image:
                "https://cdn.shopify.com/s/files/1/0376/9922/3688/products/24406_STBL.jpg?v=1631297543",
              inventoryQuantity: 10,
              price: 229.0,
              availableForSale: true,
              objectHash: "c1f060ec82a3eb1b7df4ac32568bd7cffa63a3c9",
            },
            {
              options: [
                {
                  name: "Size",
                  value: "Small",
                },
                {
                  name: "Color",
                  value: "Smolder Blue",
                },
              ],
              checkoutUri:
                "https://foundtags.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=39535844065416%26items[][quantity]=1%26return_to=/checkout",
              variantComparatorStr: "Small:Smolder Blue",
              image:
                "https://cdn.shopify.com/s/files/1/0376/9922/3688/products/24406_SMDB.jpg?v=1631297543",
              inventoryQuantity: 10,
              price: 229.0,
              availableForSale: true,
              objectHash: "4e1d1b3c37c9749e2022a53a6e70e68da2648c8f",
            },
            {
              options: [
                {
                  name: "Size",
                  value: "Large",
                },
                {
                  name: "Color",
                  value: "Camp Green",
                },
              ],
              checkoutUri:
                "https://foundtags.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=39535844098184%26items[][quantity]=1%26return_to=/checkout",
              variantComparatorStr: "Large:Camp Green",
              image:
                "https://cdn.shopify.com/s/files/1/0376/9922/3688/products/24406_CMPG.jpg?v=1631297543",
              inventoryQuantity: 10,
              price: 229.0,
              availableForSale: true,
              objectHash: "ab998d144b5400caeac6c10ad7d402fd70f52b16",
            },
          ],
        },
        meta: {
          timeTaken: "8ms",
          source: "cache",
        },
      },
      sms: {
        id: uuidv4(),
        type: "sms",
        title: "Become a Canopy Club VIP",
        banner: "",
        details:
          "Register here for VIP access to Canopy Club. You’ll get members-only exclusive content and special offers via text.",
        sendSmsUri: "",
      },
      custom: {
        id: uuidv4(),
        type: "custom",
        title: "Custom Module",
        html: "<img src='https://picsum.photos/seed/picsum/200/100' alt='banner' /><h3>Setup Instructions</h3><p>Meet the Canopy Diffuser. Like a glow up for your environment, aroma diffusion is proven to elevate your space, relieve stress and boost your mood. With no mist and no water, our diffuser releases scents into the air without any risk of harmful particles irritating your lungs or skin. The Canopy Diffuser is an entirely different experience, providing the easiest, cleanest way to enjoy aromas.</p>",
      },
    },
  },
];
