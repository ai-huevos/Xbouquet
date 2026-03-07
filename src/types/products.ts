export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface FlowerProduct {
    id: string;
    supplier_id: string;
    category_id: string;
    name: string;
    description: string | null;
    price_per_unit: number;
    stock_qty: number;
    image_url: string | null;
    status: 'active' | 'draft' | 'archived';
    box_type?: 'QB' | 'HB' | 'FB' | null;
    stems_per_bunch?: number | null;
    stem_length_cm?: number | null;
    created_at: string;
    updated_at: string;
}

export interface FlowerProductWithCategory extends FlowerProduct {
    category: ProductCategory;
}

export interface SupplierProfile {
    id: string;
    profile_id: string;
    business_name: string;
    created_at: string;
}

export interface FlowerProductWithSupplier extends FlowerProductWithCategory {
    supplier: SupplierProfile;
}
