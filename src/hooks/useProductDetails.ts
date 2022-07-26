import { useCallback, useEffect, useState } from 'react';
import { ProductDetailsType } from 'types/ProductDetailsType';
import useCacheAPI from './useCacheAPI';

function useProductDetails(
  slug: string | null,
  token: string | null = null,
  previewEvent: any,
  authFetched: boolean
): [
  ProductDetailsType | null,
  () => void,
  boolean,
  React.Dispatch<React.SetStateAction<ProductDetailsType | null>>
] {
  const [productLoading, setProductLoading] = useState<boolean>(false);

  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);

  const onSuccess = useCallback((productDetails: any) => {
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
      modules: moduleCopy,
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

  // @ts-ignore
  const [getProduct] = useCacheAPI(
    {
      method: 'GET',
      endpoint: `products/${slug}`,
      onError,
    },
    token,
    true,
    true
  );

  const getProductWithLoading = useCallback(async () => {
    setProductLoading(true);
    // @ts-ignore
    const cache = await getProduct();

    if (cache) {
      onSuccess(cache);
      setProductLoading(false);
    }

    return;
  }, [getProduct, onSuccess]);

  useEffect(() => {
    if (!authFetched) {
      return;
    }

    if (slug) {
      getProductWithLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, authFetched]);

  useEffect(() => {
    if (previewEvent && previewEvent.type === 'product') {
      setTimeout(() => {
        onSuccess(previewEvent.productDetails);
      });
    }
  }, [previewEvent, onSuccess]);

  return [
    productDetails,
    getProductWithLoading,
    productLoading,
    setProductDetails,
  ];
}

export default useProductDetails;
