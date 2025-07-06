"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LoadingStatus } from "@/components/status/pages/StatusPages";
import { Product, ProductCategory } from "@/odoo-schema-full/types";

// Dynamically import the ShopWrapper component
const ShopWrapper = dynamic(() => import("@/components/shop").then(mod => ({ default: mod.ShopWrapper })), {
	ssr: false,
	loading: () => <LoadingStatus statusType="loading" />
});

interface ShopWrapperClientProps {
	products: Product[];
	categories: ProductCategory[];
	initialPage?: "shop" | "cart" | "favorites" | "category";
	initialCategoryId?: number;
}

const ShopWrapperClient: React.FC<ShopWrapperClientProps> = (props) => {
	return <ShopWrapper {...props} />;
};

export default ShopWrapperClient; 