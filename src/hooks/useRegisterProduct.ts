import { useAPICacheContext } from 'context/APICacheContext/APICacheContext';
import { useGlobal } from 'context/global/GlobalContext';
import { useCallback, useState } from 'react';
import { useAPI } from 'utils/api';

const useRegisterProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { slug, reFetchProduct, token } = useGlobal();

  const [registerProduct] = useAPI(
    {
      method: 'POST',
      endpoint: `products/register/${slug}`,
    },
    token
  );

  const { invalidateCache } = useAPICacheContext();

  const registerProductAndFetch = useCallback(
    async (warrantyId: string) => {
      setLoading(true);

      try {
        await registerProduct({ warrantyId });
        invalidateCache();
        reFetchProduct();
        return;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [registerProduct, reFetchProduct]
  );

  return { registerProductAndFetch, loading };
};

export default useRegisterProduct;
