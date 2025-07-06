"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardContainer from "@/components/dashboard/DashboardContainer";

export default function DashboardPage() {
	const { user } = useAuth();
	return <DashboardContainer user={user} />;
}
