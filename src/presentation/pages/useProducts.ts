import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProducts } from "../../domain/GetProducts.usecase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { StoreApi } from "../../data/api/StoreApi";
import { buildProduct } from "../../data/ProductApi.repository";

export function useProducts(getProductsUseCase: GetProducts, storeApi: StoreApi) {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [error, setError] = useState("");

    useEffect(() => {
        getProductsUseCase.execute().then(_products => {
            console.log("reloadKey", reloadKey);
            setProducts(_products);
        });
    }, [reloadKey, getProductsUseCase]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }

                storeApi
                    .get(id)
                    .then(buildProduct)
                    .then(product => {
                        setEditingProduct(product);
                    })
                    .catch(() => {
                        setError(`Product with id ${id} not found`);
                    });
            }
        },
        [currentUser.isAdmin, storeApi]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, []);

    return {
        products,
        reload,
        editingProduct,
        setEditingProduct,
        updatingQuantity,
        error,
        cancelEditPrice,
    };
}
