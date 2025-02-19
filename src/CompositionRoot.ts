import { StoreApi } from "./data/api/StoreApi";
import { ProductApiRepository } from "./data/ProductApi.repository";
import { GetProductById } from "./domain/GetProductById.usecase";
import { GetProducts } from "./domain/GetProducts.usecase";
import { UpdateProductPrice } from "./domain/UpdateProductPrice.usecase";

export class CompositionRoot {
    private static instance: CompositionRoot;
    private storeApi = new StoreApi();
    productApiRepository = new ProductApiRepository(this.storeApi);

    private constructor() {}

    static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }

        return CompositionRoot.instance;
    }

    provideGetProductsUseCase(): GetProducts {
        return new GetProducts(this.productApiRepository);
    }

    provideGetProductByIdUseCase(): GetProductById {
        return new GetProductById(this.productApiRepository);
    }

    provideUpdateProductPrice(): UpdateProductPrice {
        return new UpdateProductPrice(this.productApiRepository);
    }
}
