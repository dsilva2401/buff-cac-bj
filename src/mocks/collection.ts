import { ProductDetailsType } from '../types/ProductDetailsType';
import { productDataWithUserToken } from './products';

export type CollectionDetailsType =
  | {
      brand: string;
      products: ProductDetailsType[];
    }[]
  | null;

export const initialData: CollectionDetailsType = [
  {
    brand: 'Gucci',
    products: [productDataWithUserToken],
  },
];

export default initialData;
