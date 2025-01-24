import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProducts } from "../../domain/GetProducts.usecase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProductById, ResourceNotFound } from "../../domain/GetProductById.usecase";

const priceRegex = /^\d+(\.\d{1,2})?$/;

export function useProducts(getProductsUseCase: GetProducts, getProduct: GetProductById) {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [error, setError] = useState("");
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getProductsUseCase.execute().then(_products => {
            console.log("reloadKey", reloadKey);
            setProducts(_products);
        });
    }, [reloadKey, getProductsUseCase]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (!id) return;

            if (!currentUser.isAdmin) {
                setError("Only admin users can edit the price of a product");
                return;
            }

            getProduct
                .execute(id)
                .then(setEditingProduct)
                .catch(e => {
                    const message =
                        e instanceof ResourceNotFound
                            ? e.message
                            : "We have some problems to load the product";

                    setError(message);
                });
        },
        [currentUser.isAdmin, getProduct]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, []);

    // FIXME: Price validations
    function onChangePrice(price: string): void {
        if (!editingProduct) return;

        const isValidNumber = !isNaN(+price);
        setEditingProduct({ ...editingProduct, price });

        if (!isValidNumber) {
            setPriceError("Only numbers are allowed");
        } else {
            if (!priceRegex.test(price)) {
                setPriceError("Invalid price format");
            } else if (+price > 999.99) {
                setPriceError("The max possible price is 999.99");
            } else {
                setPriceError(undefined);
            }
        }
    }

    return {
        products,
        reload,
        editingProduct,
        setEditingProduct,
        updatingQuantity,
        error,
        cancelEditPrice,
        priceError,
        onChangePrice,
    };
}
