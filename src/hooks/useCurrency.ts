import { useState } from "react";

export const useCurrency = () => {
	const [currency, setCurrency] = useState("SAR");

	return { currency, setCurrency };
};
