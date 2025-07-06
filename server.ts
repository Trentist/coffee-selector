/**
 * Next.js Server with WebSocket Integration
 * خادم Next.js مع تكامل WebSocket
 */

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { webSocketServer } from "./src/lib/socket-server";
import { realTimeService } from "./src/odoo-schema-full/real-time-system";
import { storageService } from "./src/odoo-schema-full/storage-system";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
	try {
		// Prepare Next.js app
		await app.prepare();

		// Create HTTP server
		const server = createServer(async (req, res) => {
			try {
				const parsedUrl = parse(req.url!, true);
				await handle(req, res, parsedUrl);
			} catch (err) {
				console.error("Error occurred handling request:", err);
				res.statusCode = 500;
				res.end("Internal Server Error");
			}
		});

		// Initialize WebSocket server
		webSocketServer.initialize(server);

		// Initialize services
		console.log("🚀 Initializing services...");

		// Initialize real-time service
		await realTimeService.initialize();
		console.log("✅ Real-time service initialized");

		// Initialize storage service
		await storageService.initialize();
		console.log("✅ Storage service initialized");

		// Start server
		server.listen(port, () => {
			console.log(`🚀 Server ready on http://${hostname}:${port}`);
			console.log(`🔌 WebSocket server ready on ws://${hostname}:${port}`);
			console.log("📡 Real-time system is running");
			console.log("💾 Storage system is running");
		});

		// Graceful shutdown
		process.on("SIGTERM", () => {
			console.log("🛑 SIGTERM received, shutting down gracefully...");
			shutdown();
		});

		process.on("SIGINT", () => {
			console.log("🛑 SIGINT received, shutting down gracefully...");
			shutdown();
		});

		function shutdown() {
			console.log("🛑 Shutting down server...");

			// Shutdown WebSocket server
			webSocketServer.shutdown();

			// Shutdown services
			realTimeService.shutdown();
			storageService.shutdown();

			// Close HTTP server
			server.close(() => {
				console.log("✅ Server shutdown complete");
				process.exit(0);
			});
		}
	} catch (err) {
		console.error("❌ Error starting server:", err);
		process.exit(1);
	}
}

// Start the server
startServer();
