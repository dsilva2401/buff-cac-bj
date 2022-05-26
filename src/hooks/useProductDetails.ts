import { useCallback, useEffect, useState } from 'react';
import { ProductDetailsType } from 'types/ProductDetailsType';
import { useAPI } from 'utils/api';

function useProductDetails(
  slug: string | null,
  token: string | null = null,
  previewEvent: any
): [ProductDetailsType | null, () => void, boolean] {
  const [productLoading, setProductLoading] = useState<boolean>(false);

  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);

  const onSuccess = useCallback((productDetails) => {
    const { product, modules } = productDetails;

    // if the product is already registered to some user don't show activate warranty
    const leadModule = modules[0];
    let moduleCopy = [...modules];

    if (
      !product.registeredToCurrentUser &&
      product.registered &&
      product.tagType === 'Unit'
    ) {
      moduleCopy = moduleCopy.filter(
        (module) => module.type !== 'WARRANTY_MODULE'
      );
    }

    setProductDetails({
      ...productDetails,
      modules: [...moduleCopy],
      leadModule,
    });

    setProductLoading(false);
  }, []);

  const onError = useCallback(
    (error) => {
      if (error.name !== 'AbortError') {
        setProductLoading(false);
      }
    },
    [setProductLoading]
  );

  const [getProduct, _, controller] = useAPI(
    {
      method: 'GET',
      endpoint: `products/${slug}`,
      onSuccess,
      onError,
    },
    token
  );

  const getProductWithLoading = useCallback(() => {
    getProduct();
    setProductLoading(true);
  }, [getProduct]);

  useEffect(() => {
    if (slug) {
      controller && controller.abort();
      getProductWithLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, slug, getProductWithLoading]);

  useEffect(() => {
    if (previewEvent && previewEvent.type === 'product') {
      onSuccess(previewEvent.productDetails);
    }
  }, [previewEvent, onSuccess]);

  return [productDetails, getProductWithLoading, productLoading];
}

export default useProductDetails;
