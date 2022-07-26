import { RegistrationType } from './getRegisterText';

const getSuccessTitle = (
  registrationType: string = RegistrationType.REGISTER
): string => {
  switch (registrationType) {
    case RegistrationType.REGISTER:
      return 'productRegistered';
    case RegistrationType.SIGNUP:
      return 'signedUp';
    case RegistrationType.ACTIVATE:
      return 'warrantyActivated';
  }

  return 'Product Registered!';
};

export default getSuccessTitle;
