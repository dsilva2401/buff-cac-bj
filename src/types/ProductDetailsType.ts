export type PossibleModulesType =
  | 'WARRANTY_MODULE'
  | 'CUSTOM_MODULE'
  | 'LINK_MODULE'
  | 'SHOPPING_MODULE'
  | 'REGISTRATION_MODULE'
  | 'REFERRAL_MODULE';

export interface Product {
  id: string;
  name: string;
  // @manoj: same as brand image i.e. construct and send a full url
  image: string;
  // @sush: I need to clarify where to get this from. For now, just set it to false
  registered: boolean;
  registeredToCurrentUser: boolean;
  // ageGate field in document
  ageGateEnabled: boolean;
  // date on which the product was registered
  registeredDate: string;
  // defines the type of tag
  tagType: string;
};

export type ModuleInfoType = {
  // Find this in Products => modules array

  // Module Id
  id: string;
  // Module type
  type: PossibleModulesType;
  // Sort order is the order in which it is shown in modal screen
  // sortOrder: number;
  // If it is lead module, then it should be shown highlighted in primary color
  // isLeadModule: boolean;
  // this is action field from the actual module data. All modules will have an action field that refers to name shown in title. We call it title as it is title displayed
  title: string;
  // this indicates whether we need an actual login to unlock this module
  locked: boolean;
  registrationRequired: boolean;
  // actual module info. Note, this field is optional. It will be present if locked is set to false. If locked is true, then this field is set to null
  moduleInfo:
    | CustomModuleType
    | LinkModuleType
    | WarrantyModuleType
    | ShoppingModuleType
    | ReferralModuleType
    | null;
};

export type CustomModuleType = {
  // All of these fields here should not be populated if locked is true and user token is not present

  // customModule collection

  // content field
  // @arqam: the content will be html string. We need to render it as an html. It may have image, text, heading etc.
  content: string;
};

export type LinkModuleType = {
  // All of these fields here should not be populated if locked is true and user token is not present
  // leadModule collection

  // link refers to destination field
  // @arqam: This will be a url which when the user clicks will go directly to this page
  link: string;
};

export type WarrantyModuleType = {
  // All of these fields here should not be populated if locked is true and user token is not present
  // Find this in warrantyModule collection

  // details field
  details: string;

  // period field
  period: number;

  // duration
  duration: {
    label: string;
    value: string;
  };

  // This field should be stored prob. under user -> profile -> warranty object and created when user registers for warranty
  activated: boolean;

  // same as above, created when user called activateWarranty mutation. If not set, returned undefined
  purchaseDate?: string; // UTC timestamp

  // same as above, created and set when user called activateWarranty mutation, If not set, it is undefined
  // expirationDate = purchaseDate + period duration
  expirationDate?: string; // UTC timestamp

  // optional mulberry warranty coverage details
  mulberry?: {
    coverages: string[];
    policyTermsUrl: string;
    warrantyOfferId: string;
    issueDate: string;
    expirationDate: string;
  };
};

export type ShoppingModuleOptionsType = {
  /* All options presented as name, values array key pair*/
  name: string;
  value: string;
  values: string[];
};

export type AllOptionsType = Pick<ShoppingModuleOptionsType, 'name' | 'values'>;

export type OptionsType = {
  [key: string]: string;
};

export type VariantDetails = {
  /* VariantId */
  id: string;
  /* name of this variant */
  name: string;
  /* Image */
  image: string;
  /* Price of item */
  price: string;
  /* Discounted price if available */
  discountedPrice?: string;
  /* Maximum quantity available */
  inventoryQuantity: number;
  /* Checkout link for this variant */
  checkoutUri: string;
  /* These are options list for this variant */
  options?: OptionsType;
  /* Object hash. Use this field on client side to check if the option chosen is valid */
  objectHash?: string;
};

export type ShoppingModuleType = {
  // All of these fields here should not be populated if locked is true and user token is not present
  defaultVariantDetails: VariantDetails;
  isDiscountAvailable: boolean;
  discountPercentage?: number;
  discountCode?: string;
  isProductLevel: boolean;
  allOptions?: AllOptionsType[];
  variantDetails?: VariantDetails[];
};

export type ReferralModuleType = {
  // All of these fields here should not be populated if locked is true and user token is not present
  // Find this in referralModule collection

  // This is from text field rich html text
  details: string;
  url: string;
  qrcode: string;
};

export type ProductDetailsType = {
  // @manoj: Find this in Tag => slug
  // brand refers to brandId which is userId in Users collection
  // product refers to productId which is _id in Products collection
  tag: {
    slug: string;
  };

  registration: {
    registrationText: string;
  };

  warrantyInformation: {
    period: number;

    // duration
    duration: {
      label: string;
      value: string;
    };
  };
  // Find this data in  Users => profile
  brand: {
    id: string;
    // @manoj: Construct complete image url from Image object and set value to it.
    image: string;
    name: string;
    website: string;
    customAccentColor?: string;
    customBgColor?: string;
    registrationDetails?: string;
    social: {
      // @manoj: Check individually e.g. if socialPhoneNumberEnable is true, set phone to socialPhoneNumber
      // Otherwise, set phone is undefined. Similarly for others
      phone?: string;
      email?: string;
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  // Find this data in Products
  product: Product;
  // @arqam: modules will now be sent as an array of ModulesUnion type
  // You need to loop through it to check what kind of module it is and then
  // get resulting info. Also sort order indicates the order in which it is shown
  // leadModule = true is the first module that should be shown
  modules: ModuleInfoType[];

  leadModule?: ModuleInfoType;
};
