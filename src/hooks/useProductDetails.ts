import { useCallback, useEffect, useState } from 'react';
import { ProductDetailsType } from 'types/ProductDetailsType';
import { useAPI } from 'utils/api';

function useProductDetails(slug: string | null, token: string | null = null, previewEvent: any): [
  ProductDetailsType | null,
  () => Promise<any>,
  boolean
] {
  const [productDetails, setProductDetails] = useState<ProductDetailsType | null>(null);

  const onSuccess = useCallback((productDetails) => {
    const { product, modules } = productDetails;

    // if the product is already registered to some user don't show activate warranty
    const leadModule = modules[0];
    let moduleCopy = [...modules];

    if (
      !product.registeredToCurrentUser
      && product.registered
      && product.tagType === 'Unit'
    ) {
      moduleCopy = moduleCopy.filter(
        module => module.type !== 'WARRANTY_MODULE'
      )
    };

    setProductDetails({ ...productDetails, modules: [...moduleCopy], leadModule });
  }, []);

  const onError = useCallback((error) => {
    console.log('ERROR CODE: ', error.code);
    console.log('ERROR MSG: ', error.message);
  }, [])

  const [getProduct, loading] = useAPI({
    method: 'GET',
    endpoint: `products/${slug}`,
    onSuccess,
    onError
  }, token)

  useEffect(() => {
    if (slug) getProduct();
  }, [token, slug, getProduct])

  useEffect(() => {
    if (previewEvent && previewEvent.type === 'product') {
      onSuccess(previewEvent.productDetails);
    }
  }, [previewEvent]);

  return [productDetails, getProduct, loading];
}

export default useProductDetails;
