import { useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProducts } from "../../domain/GetProducts.usecase";
import { Product } from "../../domain/Product";

export function useProducts(getProductsUseCase: GetProducts) {
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getProductsUseCase.execute().then(_products => {
            console.log("reloadKey", reloadKey);
            setProducts(_products);
        });
    }, [reloadKey, getProductsUseCase]);

    return {
        products,
        reload,
    };
}
