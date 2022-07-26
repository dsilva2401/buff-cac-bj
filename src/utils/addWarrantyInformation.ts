import dayjs, { ManipulateType } from 'dayjs';
import {
  ModuleInfoType,
  ProductDetailsType,
  WarrantyModuleType,
} from 'types/ProductDetailsType';

const addWarrantyInformation = (
  warrantyModule: ModuleInfoType,
  productDetails: ProductDetailsType
) => {
  const { period, duration } = warrantyModule.moduleInfo as WarrantyModuleType;

  const purchaseDate = Date.now();
  const expirationDate = dayjs()
    .add(period, duration?.value?.toLowerCase() as ManipulateType)
    .valueOf();

  const modules =
    productDetails?.modules?.map((module: any) => {
      if (module.id === warrantyModule?.id) {
        return {
          ...module,
          moduleInfo: {
            ...module.moduleInfo,
            purchaseDate,
            expirationDate,
            activated: true,
          },
        };
      }

      return module;
    }) || [];

  return {
    ...productDetails,
    product: { ...productDetails?.product, registeredToCurrentUser: true },
    modules,
  };
};

export default addWarrantyInformation;
