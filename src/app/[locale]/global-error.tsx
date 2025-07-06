"use client";

import { useTranslations } from "next-intl";

export default function GlobalError({

	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations("common");

	return (
		<html>
			<body>
				<div>
					<h1>{t("messages.error")}</h1>
					<button onClick={() => reset()}>{t("buttons.retry")}</button>
				</div>
			</body>
		</html>
	);
}
