"use client";

import { useState } from "react";

export const useSettings = () => {
	const [settings, setSettings] = useState({});

	return { settings, setSettings };
};