export interface ProductSpecs {
    [key: string]: string;
}

export interface ProductFilters {
    [key: string]: string;
}

export interface ProductData {
    productCode: string;
    name: string;
    category: string;
    categorySlug: string;
    subcategory: string;
    subcategorySlug: string;
    brand: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    images: string[];
    slug: string;
    searchKey: string;
    specs: ProductSpecs;
    filters: ProductFilters;
    description: string;
}
