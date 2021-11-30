import { ProductDetailsType } from '../types/ProductDetailsType';
export const logMessage = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, optionalParams);
  }
};

export const transformProductDetailsObj = (
  tagData: any
): ProductDetailsType => {
  const { product, brand, slug } = tagData;
  const {
    socialPhoneNumberEnable,
    socialPhoneNumber,
    socialEmailEnable,
    socialEmail,
    twitterEnable,
    twitterURL,
    instagramEnable,
    instagramURL,
    facebookEnable,
    facebookURL,
    brandLogo,
    brandName,
  } = brand.profile;

  return {
    tag: {
      slug,
    },
    product: {
      id: product._id,
      name: product.productName,
      image: product.productImage,
      registered: product.registered,
      ageGateEnabled: product.ageGate,
    },
    brand: {
      id: brand._id,
      image: brandLogo,
      name: brandName,
      social: {
        phone: socialPhoneNumberEnable ? socialPhoneNumber : null,
        email: socialEmailEnable ? socialEmail : null,
        twitter: twitterEnable ? twitterURL : null,
        instagram: instagramEnable ? instagramURL : null,
        facebook: facebookEnable ? facebookURL : null,
      },
    },
    modules: {},
  };
};
