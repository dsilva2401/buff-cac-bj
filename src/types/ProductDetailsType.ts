export type PossibleModulesType =
  | 'WARRANTY_MODULE'
  | 'CUSTOM_MODULE'
  | 'LINK_MODULE'
  | 'SHOPPING_MODULE';

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
  // actual module info. Note, this field is optional. It will be present if locked is set to false. If locked is true, then this field is set to null
  moduleInfo: CustomModuleType | LinkModuleType | WarrantyModuleType | null;
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
  duration: string;

  // This field should be stored prob. under user -> profile -> warranty object and created when user registers for warranty
  activated: boolean;

  // same as above, created when user called activateWarranty mutation. If not set, returned undefined
  purchaseDate?: string; // UTC timestamp

  // same as above, created and set when user called activateWarranty mutation, If not set, it is undefined
  // expirationDate = purchaseDate + period duration
  expirationDate?: string; // UTC timestamp
};

export type ShoppingModuleType = {
  // All of these fields here should not be populated if locked is true and user token is not present

  // You will get productId from shoppingModule collection
  // You will get rest of details from shopping microservice by passing this id

  // image of the lead product
  image: string;
  discountedPrice: string;
  price: string;
  name: string;
  defaultQuantity: number;
  checkoutUri: string;
  details?: {
    key: string;
    possibleValues: string[];
    defaultValue: string;
  }[];
};

export type ProductDetailsType = {
  // @manoj: Find this in Tag => slug
  // brand refers to brandId which is userId in Users collection
  // product refers to productId which is _id in Products collection
  tag: {
    slug: string;
  };
  // Find this data in  Users => profile
  brand: {
    id: string;
    // @manoj: Construct complete image url from Image object and set value to it.
    image: string;
    name: string;
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
  product: {
    id: string;
    name: string;
    // @manoj: same as brand image i.e. construct and send a full url
    image: string;
    // @sush: I need to clarify where to get this from. For now, just set it to false
    registered: boolean;
    // ageGate field in document
    ageGateEnabled: boolean;
  };
  // @arqam: modules will now be sent as an array of ModulesUnion type
  // You need to loop through it to check what kind of module it is and then
  // get resulting info. Also sort order indicates the order in which it is shown
  // leadModule = true is the first module that should be shown
  modules: ModuleInfoType[];
};
