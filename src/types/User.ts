export interface EmailType {
  email: string,
  verified: boolean
};

export interface Warranty {
  warrantyId: string,
  activated: boolean;
  purchaseDate?: string;
  expirationDate?: string;
};

export interface CollectionItem {
	brandId?: string;
	productId?: string;
	variantId?: string;
	tagId: string;
}
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
  warranties?: Warranty[];
  productCollection?: CollectionItem[]
};

export interface UserSigninBody {
  email: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
  tag?: string
};

export interface UserUpdateBody {
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
};

export interface UserStruct {
  _id: string,
  services: null | any,
  username: string,
  emails: EmailType[],
  profile: UserProfile
};

export interface UserCreatePayload {
  email: string | null,
  phoneNumber: string | null,
  firstName: string | null,
  lastName: string | null,
  tag?: string
};
