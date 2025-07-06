import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const resolvedOdooUrl = getOdooProxyUrl();

function getOdooProxyUrl() {
  if (typeof window === "undefined") {
	// Server-side: use env or fallback
	const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000";
	// Remove trailing slash if present
	const baseUrl = base.replace(/\/$/, "");
	return `${baseUrl}/api/odoo-proxy`;
  }
  // Client-side: relative URL
  return "/api/odoo-proxy";
}

const authLink = setContext((_, { headers }) => {
    const token =
        process.env.NEXT_PUBLIC_ODOO_API_KEY ||
        "d22fb86e790ba068c5b3bcfb801109892f3a0b38";
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const httpLink = createHttpLink({
  uri: resolvedOdooUrl,
});

export function getServerApolloClient() {
  return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                errorPolicy: "all",
            },
            query: {
                errorPolicy: "all",
            },
        },
    });
}
