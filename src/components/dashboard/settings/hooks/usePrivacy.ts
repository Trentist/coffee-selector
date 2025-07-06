"use client";

import { useState } from "react";

export const usePrivacy = () => {
	const [privacy, setPrivacy] = useState({});

	return { privacy, setPrivacy };
};