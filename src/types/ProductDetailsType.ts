export type ModuleTypeName =
  | "warranty"
  | "shop"
  | "info"
  | "sms"
  | "registration"
  | "custom";

export type ModuleBaseType = {
  /* Indicates the type of module */
  type: ModuleTypeName;
  /* Module Id */
  id: string;
  /* Module title. If this doesn't exist, then we should use one in constants from i18n */
  title?: string;
};

export type ProductInfoModuleType = ModuleBaseType & {
  /* Product serial number */
  serialNumber: string;
  /* Product image */
  image?: string;
  /* Product description */
  description?: string;
  /* Product features */
  features?: string[];
};

export type RegistrationModuleType = ModuleBaseType & {
  /* Registration banner */
  banner?: string;
  /* Warranty heading text below the banner */
  heading?: string;
  /* Warranty description */
  description: string;
  /* Link to redirect to after registration */
  nextLink?: string;
};

export type WarrantyModuleType = ModuleBaseType & {
  /* Is warranty active? */
  activated: boolean;
  /* Banner image */
  banner: string;
  /* The heading text directly below the banner */
  heading: string;
  /* Description below banner image */
  description: string;
  warrantyStatus: {
    /* Details of warranty shown in warranty status page */
    details: string;
    /* Duration of warranty */
    duration: string;
    /* Status of warranty */
    status: string;
    /* Purchase date */
    purchaseDate?: string;
    /* Expiration date */
    expirationDate?: string;
    /* receiptRequired true indicates receipt uploader should be shown */
    receiptRequired?: boolean;
  };
};

export type ShoppingVaraintOptionsType = {
  /* name and values for available variant options  */
  options: {
    name: string;
    value: string;
  }[];
  /* link to the checkout page of the product */
  checkoutUri: string;
  /* comparator string to make comparisions within the frontend */
  variantComparatorStr: string;
  /* image for a specific product variant */
  image: string;
  /* available quantity for a specific product variant */
  inventoryQuantity?: number;
  /* price of a specific product variant */
  price: number;
  /* indicates if a specific product variant is available for sale */
  availableForSale: boolean;
  /* hash of the variant to verify integrity */
  objectHash: string;
};

export type ShoppingModuleType = ModuleBaseType & {
  shoppingVariantDetails: {
    /* available options for product variants and their values */
    allOptions: {
      name: string;
      values: string[];
    }[];
    /* default image to show if no variant is selected */
    productImage: string;
    /* any available percentage of discount */
    discount?: number;
    /* data for any valid variant of the product */
    validVariantOptions: ShoppingVaraintOptionsType[];
  };
  /* meta data for the variant */
  meta?: {
    /* time taken to load form */
    timeTaken?: string;
    /* fetch source */
    source?: string;
  };
};

export type SubscriptionModuleType = ModuleBaseType &
  ShoppingModuleType & {
    subscriptionDetails: {
      /* Shopping plan Id */
      id: string;
      /* Description of subscription option e.g. Every 10 days */
      description: string;
      /* Indicates whether this is selected by default in radio box */
      selected: boolean;
    }[];
  };

export type CustomModuleType = ModuleBaseType & {
  /* html for custom module's content */
  html: string;
};

export type ReferralModuleType = ModuleBaseType & {
  banner: string;
  description: string;
  referralUri: string;
  qrCode: string;
};

export type SMSModuleType = ModuleBaseType & {
  banner: string;
  details: string;
  sendSmsUri: string;
};

export type LostAndFoundModuleType = ModuleBaseType & {
  // TODO
};

export type LinkModuleType = ModuleBaseType & {
  link: string;
};

export type ProductDetailsType = {
  tag: {
    slug: string;
  };
  brand: {
    id: string;
    image: string;
    name: string;
    social: {
      phone?: string;
      email?: string;
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  product: {
    id: string;
    name: string;
    image: string;
    registered: boolean;
    ageGateEnabled?: boolean;
  };
  modules: {
    // List all possible modules and their types

    /* Registration module */
    registration?: RegistrationModuleType;

    /* Info module */
    info?: ProductInfoModuleType;

    /* Warranty module */
    warranty?: WarrantyModuleType;

    /* Shopping module */
    shop?: ShoppingModuleType;

    /* Subscription module */
    subscription?: SubscriptionModuleType;

    /* Custom module */
    custom?: CustomModuleType;

    /* Referral module */
    referral?: ReferralModuleType;

    /* SMS module */
    sms?: SMSModuleType;

    /* Lost and Found module */
    lostAndFound?: LostAndFoundModuleType;

    /* Link Module */
    link?: LinkModuleType;
  };
};
