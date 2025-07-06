import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	eslint: {
		// تعطيل ESLint تماماً
		ignoreDuringBuilds: true,
	},
	typescript: {
		// تعطيل فحص TypeScript
		ignoreBuildErrors: true,
	},
};

export default withNextIntl(nextConfig);
