export interface DesignDetail {
    title: string;
    description: string;
    tags: string[];
    color: string;
    price: number;
}

export interface Design {
    userId: string;
    designDetail: DesignDetail;
    image: string;
    decal?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DesignCreateInput {
    userId: string;
    designDetail: DesignDetail;
    image: string;
    decal?: string;
}

export interface DesignUpdateInput {
    designDetail?: Partial<DesignDetail>;
    image?: string;
    decal?: string;
}

export interface DesignQueryOptions {
    userId?: string;
    tags?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
