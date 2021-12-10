import { ProductDetailsType } from "types/ProductDetailsType";
import { v4 as uuidv4 } from "uuid";

export const productDataWithoutUserToken: ProductDetailsType = {
  tag: {
    slug: "0SVJ",
  },
  brand: {
    id: uuidv4(),
    image:
      "https://firebasestorage.googleapis.com/v0/b/gucci-demo.appspot.com/o/logo-gucci.png?alt=media&token=fe7b6317-e65e-45c9-a30e-0fe809f9c809",
    name: "Gucci",
    social: {
      phone: "0012345678",
      email: "testemail@brig.com",
      twitter: "www.twitter.com",
      instagram: "www.instagram.com",
      facebook: "www.facebook.com",
    },
  },
  product: {
    id: uuidv4(),
    name: "Horsebit",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    registered: false,
    ageGateEnabled: true,
  },
  modules: [
    {
    id: uuidv4(),
      type: "CUSTOM_MODULE",
      title: "Setup Instructions",
      locked: false,
      moduleInfo: {
        content:
          "<h3>Setup Instructions</h3><p>Meet the Canopy Diffuser. Like a glow up for your environment, aroma diffusion is proven to elevate your space, relieve stress and boost your mood. With no mist and no water, our diffuser releases scents into the air without any risk of harmful particles irritating your lungs or skin. The Canopy Diffuser is an entirely different experience, providing the easiest, cleanest way to enjoy aromas.</p>",
      },
    },
    {
    id: uuidv4(),
      type: "WARRANTY_MODULE",
      title: "Activate Warranty",
      locked: true,
      moduleInfo: null,
    },
    {
    id: uuidv4(),
      type: "LINK_MODULE",
      title: "Visit our website",
      locked: false,
      moduleInfo: {
        link: "https://www.google.com",
      },
    },
  ],
};

export const productDataWithUserToken: ProductDetailsType = {
  tag: {
    slug: "0SVJ",
  },
  brand: {
    id: uuidv4(),
    image:
      "https://firebasestorage.googleapis.com/v0/b/gucci-demo.appspot.com/o/logo-gucci.png?alt=media&token=fe7b6317-e65e-45c9-a30e-0fe809f9c809",
    name: "Gucci",
    social: {
      phone: "0012345678",
      email: "testemail@brig.com",
      twitter: "www.twitter.com",
      instagram: "www.instagram.com",
      facebook: "www.facebook.com",
    },
  },
  product: {
    id: uuidv4(),
    name: "Horsebit",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    registered: false,
    ageGateEnabled: true,
  },
  modules: [
    {
      id: uuidv4(),
      type: "CUSTOM_MODULE",
      title: "Setup Instructions",
      locked: false,
      moduleInfo: {
        content:
          "<img src='https://picsum.photos/seed/picsum/200/100' alt='banner' /><h3>Setup Instructions</h3><p>Meet the Canopy Diffuser. Like a glow up for your environment, aroma diffusion is proven to elevate your space, relieve stress and boost your mood. With no mist and no water, our diffuser releases scents into the air without any risk of harmful particles irritating your lungs or skin. The Canopy Diffuser is an entirely different experience, providing the easiest, cleanest way to enjoy aromas.</p>",
      },
    },
    {
      id: uuidv4(),
      type: "WARRANTY_MODULE",
      title: "Activate Warranty",
      locked: false,
      moduleInfo: {
        details:
          "<h4>Rest Easy</h4><p>Products purchased from an Authorized Retailer are fully warranted against defects in materials and workmanship for 2 years for the original owner. Register this product now to activate its warranty.</p><p>This warranty protects your device for 1 year after purchase. Register below to activate your warranty.</p>",
        period: 1,
        duration: "year",
        activated: false,
      },
    },
    {
      id: uuidv4(),
      type: "LINK_MODULE",
      title: "Visit our website",
      locked: false,
      moduleInfo: {
        link: "https://www.google.com",
      },
    },
  ],
};
