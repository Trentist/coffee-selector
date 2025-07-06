import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

// Root layout with required HTML structure
export default function RootLayout({ children }: Props) {
	return children;
}
