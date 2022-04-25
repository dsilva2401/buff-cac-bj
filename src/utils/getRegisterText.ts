export enum RegistrationType {
  REGISTER = 'Product_Registration',
  SIGNUP = 'Marketing_List_Signup',
  ACTIVATE = 'Warranty_Activation',
}

export const getRegisterText = (
  registrationType?: RegistrationType
): string => {
  switch (registrationType) {
    case RegistrationType.REGISTER:
      return 'Register';
    case RegistrationType.SIGNUP:
      return 'Sign Up';
    case RegistrationType.ACTIVATE:
      return 'Activate';
    default:
      return 'Register';
  }
};
