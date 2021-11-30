import { ProductDetailsType } from '../types/ProductDetailsType';
import { products } from './products';

export type CollectionDetailsType =
  | {
      brand: string;
      products: ProductDetailsType[];
    }[]
  | null;

export const initialData: CollectionDetailsType = [
  {
    brand: 'Gucci',
    products: products,
  },
];

export default initialData;
