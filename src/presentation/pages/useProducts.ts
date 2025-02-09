import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProducts } from "../../domain/GetProducts.usecase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProductById, ResourceNotFound } from "../../domain/GetProductById.usecase";
import { Price } from "../../domain/Price";

export type ProductStatus = "active" | "inactive";

export type ProductViewModel = Product & { status: ProductStatus };

function buildProductViewModel(product: Product): ProductViewModel {
    return {
        ...product,
        status: +product.price === 0 ? "inactive" : "active",
    };
}

export function useProducts(getProductsUseCase: GetProducts, getProduct: GetProductById) {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<ProductViewModel[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);
    const [error, setError] = useState("");
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getProductsUseCase.execute().then(_products => {
            console.log("reloadKey", reloadKey);
            setProducts(_products.map(buildProductViewModel));
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
                .then(p => setEditingProduct(buildProductViewModel(p)))
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

    function onChangePrice(price: string): void {
        if (!editingProduct) return;

        try {
            setEditingProduct({ ...editingProduct, price });
            Price.create(price);
            setPriceError(undefined);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unexpected error has occurred";
            console.log(message);
            setPriceError(message);
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
