import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProducts } from "../../domain/GetProducts.usecase";
import { Product, ProductData, ProductStatus } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProductById, ResourceNotFound } from "../../domain/GetProductById.usecase";
import { Price } from "../../domain/Price";
import { UpdateProductPrice } from "../../domain/UpdateProductPrice.usecase";

export type ProductViewModel = ProductData & { status: ProductStatus };

type Message = { type: "success" | "error"; text: string };

function buildProductViewModel(product: Product): ProductViewModel {
    return {
        ...product,
        price: product.price.value.toFixed(2),
    };
}

export function useProducts(
    getProductsUseCase: GetProducts,
    getProduct: GetProductById,
    updateProductPrice: UpdateProductPrice
) {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<ProductViewModel[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);
    const [message, setMessage] = useState<Message>();
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
                setMessage({
                    type: "error",
                    text: "Only admin users can edit the price of a product",
                });
                return;
            }

            getProduct
                .execute(id)
                .then(p => setEditingProduct(buildProductViewModel(p)))
                .catch(e => {
                    const text =
                        e instanceof ResourceNotFound
                            ? e.message
                            : "We have some problems to load the product";

                    setMessage({ type: "error", text });
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

    async function saveEditPrice(): Promise<void> {
        if (editingProduct) {
            try {
                await updateProductPrice.execute(
                    currentUser,
                    editingProduct.id,
                    editingProduct.price
                );
                setMessage({
                    type: "success",
                    text: `Price ${editingProduct.price} for '${editingProduct.title}' updated`,
                });
                setEditingProduct(undefined);
                reload();
            } catch (error) {
                setMessage({
                    type: "success",
                    text: `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`,
                });
                setEditingProduct(undefined);
                reload();
            }
        }
    }

    const onCloseMessage = useCallback(() => {
        setMessage(undefined);
    }, []);

    return {
        products,
        editingProduct,
        updatingQuantity,
        message,
        onCloseMessage,
        cancelEditPrice,
        priceError,
        onChangePrice,
        saveEditPrice,
    };
}
