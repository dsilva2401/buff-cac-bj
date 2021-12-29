import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { ProductDetailsType } from "types/ProductDetailsType";
import { useAPI } from "utils/api";

function useProductDetails(slug: string | null, user: User | null = null): [
    ProductDetailsType | null,
    () => Promise<any>
] {
    const [productDetails, setProductDetails] = useState<ProductDetailsType | null>(null);

    const onSuccess = useCallback((productDetails) => {
        setProductDetails(productDetails);
    }, [])
    
    const onError = useCallback((error) => {
        console.log('ERROR CODE: ', error.code);
        console.log('ERROR MSG: ', error.message);
    }, [])

    const [getProduct] = useAPI({
        method: 'GET',
        endpoint: `products/${slug}`,
        onSuccess,
        onError
    }, user)

    useEffect(() => {
        if (slug) {
            getProduct()
        }
    }, [user, slug, getProduct])

    return [productDetails, getProduct];
}

export default useProductDetails;
