import { User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { ProductDetailsType } from 'types/ProductDetailsType';
import { useAPI } from 'utils/api';

function useCollection(
  user: User | null = null
): [ProductDetailsType[], () => Promise<any>] {
  const [collectionDetails, setCollectionDetails] = useState<
    ProductDetailsType[]
  >([]);

  const onSuccess = useCallback((details) => {
    console.log('onSuccess details: ', details);
    setCollectionDetails(details);
  }, []);

  const onError = useCallback((error) => {
    console.log('ERROR CODE: ', error.code);
    console.log('ERROR MSG: ', error.message);
  }, []);

  const [getCollection] = useAPI(
    {
      method: 'GET',
      endpoint: `products/collection`,
      onSuccess,
      onError,
    },
    user
  );

  useEffect(() => {
    if (user) {
      getCollection();
    }
  }, [user, getCollection]);

  return [collectionDetails, getCollection];
}

export default useCollection;
