/**
 * WebSocket Server with Socket.io
 * خادم WebSocket مع Socket.io
 */

import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import {
	realTimeService,
	RealTimeEvent,
} from "@/odoo-schema-full/real-time-system";

export interface SocketData {
	userId?: string;
	sessionId: string;
	channels: string[];
	rooms: string[];
}

class WebSocketServer {
	private io: SocketIOServer | null = null;
	private isInitialized: boolean = false;
	private connectionMap: Map<string, string> = new Map(); // socketId -> connectionId

	/**
	 * Initialize WebSocket server
	 */
	initialize(httpServer: HTTPServer): void {
		if (this.isInitialized) {
			return;
		}

		this.io = new SocketIOServer(httpServer, {
			cors: {
				origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
				methods: ["GET", "POST"],
				credentials: true,
			},
			transports: ["websocket", "polling"],
		});

		this.setupEventHandlers();
		this.isInitialized = true;

		console.log("🔌 WebSocket Server initialized");
	}

	/**
	 * Setup Socket.io event handlers
	 */
	private setupEventHandlers(): void {
		if (!this.io) return;

		this.io.on("connection", async (socket) => {
			console.log(`🔗 Client connected: ${socket.id}`);

			// Initialize real-time service
			await realTimeService.initialize();

			// Handle authentication
			socket.on(
				"authenticate",
				async (data: { userId: string; sessionId: string }) => {
					try {
						const connection = realTimeService.connect(
							data.sessionId,
							data.userId,
						);
						this.connectionMap.set(socket.id, connection.id);

						socket.data = {
							userId: data.userId,
							sessionId: data.sessionId,
							channels: [],
							rooms: [],
						};

						socket.emit("authenticated", {
							success: true,
							connectionId: connection.id,
							message: "Successfully authenticated",
						});

						console.log(
							`✅ Client authenticated: ${socket.id} (User: ${data.userId})`,
						);
					} catch (error) {
						socket.emit("authenticated", {
							success: false,
							error: "Authentication failed",
						});
					}
				},
			);

			// Handle channel subscription
			socket.on("subscribe", async (data: { channelName: string }) => {
				try {
					const connectionId = this.connectionMap.get(socket.id);
					if (!connectionId) {
						socket.emit("subscription_result", {
							success: false,
							error: "Not authenticated",
						});
						return;
					}

					const success = realTimeService.subscribe(
						connectionId,
						data.channelName,
					);
					if (success) {
						socket.join(data.channelName);
						socket.data.channels.push(data.channelName);

						socket.emit("subscription_result", {
							success: true,
							channelName: data.channelName,
							message: "Subscribed to channel",
						});

						console.log(
							`📡 Client ${socket.id} subscribed to: ${data.channelName}`,
						);
					} else {
						socket.emit("subscription_result", {
							success: false,
							error: "Failed to subscribe",
						});
					}
				} catch (error) {
					socket.emit("subscription_result", {
						success: false,
						error: "Subscription error",
					});
				}
			});

			// Handle channel unsubscription
			socket.on("unsubscribe", async (data: { channelName: string }) => {
				try {
					const connectionId = this.connectionMap.get(socket.id);
					if (!connectionId) {
						socket.emit("unsubscription_result", {
							success: false,
							error: "Not authenticated",
						});
						return;
					}

					const success = realTimeService.unsubscribe(
						connectionId,
						data.channelName,
					);
					if (success) {
						socket.leave(data.channelName);
						socket.data.channels = socket.data.channels.filter(
							(ch) => ch !== data.channelName,
						);

						socket.emit("unsubscription_result", {
							success: true,
							channelName: data.channelName,
							message: "Unsubscribed from channel",
						});

						console.log(
							`📡 Client ${socket.id} unsubscribed from: ${data.channelName}`,
						);
					} else {
						socket.emit("unsubscription_result", {
							success: false,
							error: "Failed to unsubscribe",
						});
					}
				} catch (error) {
					socket.emit("unsubscription_result", {
						success: false,
						error: "Unsubscription error",
					});
				}
			});

			// Handle room joining
			socket.on("join_room", async (data: { roomName: string }) => {
				try {
					const connectionId = this.connectionMap.get(socket.id);
					if (!connectionId) {
						socket.emit("room_result", {
							success: false,
							error: "Not authenticated",
						});
						return;
					}

					const success = realTimeService.joinRoom(connectionId, data.roomName);
					if (success) {
						socket.join(data.roomName);
						socket.data.rooms.push(data.roomName);

						socket.emit("room_result", {
							success: true,
							roomName: data.roomName,
							action: "joined",
							message: "Joined room",
						});

						console.log(`🏠 Client ${socket.id} joined room: ${data.roomName}`);
					} else {
						socket.emit("room_result", {
							success: false,
							error: "Failed to join room",
						});
					}
				} catch (error) {
					socket.emit("room_result", {
						success: false,
						error: "Room join error",
					});
				}
			});

			// Handle room leaving
			socket.on("leave_room", async (data: { roomName: string }) => {
				try {
					const connectionId = this.connectionMap.get(socket.id);
					if (!connectionId) {
						socket.emit("room_result", {
							success: false,
							error: "Not authenticated",
						});
						return;
					}

					const success = realTimeService.leaveRoom(
						connectionId,
						data.roomName,
					);
					if (success) {
						socket.leave(data.roomName);
						socket.data.rooms = socket.data.rooms.filter(
							(room) => room !== data.roomName,
						);

						socket.emit("room_result", {
							success: true,
							roomName: data.roomName,
							action: "left",
							message: "Left room",
						});

						console.log(`🏠 Client ${socket.id} left room: ${data.roomName}`);
					} else {
						socket.emit("room_result", {
							success: false,
							error: "Failed to leave room",
						});
					}
				} catch (error) {
					socket.emit("room_result", {
						success: false,
						error: "Room leave error",
					});
				}
			});

			// Handle custom events
			socket.on(
				"custom_event",
				async (data: { event: RealTimeEvent; target?: string }) => {
					try {
						const connectionId = this.connectionMap.get(socket.id);
						if (!connectionId) {
							socket.emit("custom_event_result", {
								success: false,
								error: "Not authenticated",
							});
							return;
						}

						// Process custom event
						if (data.target) {
							// Send to specific room or channel
							const recipients = await realTimeService.sendToRoom(
								data.target,
								data.event,
							);
							socket.emit("custom_event_result", {
								success: true,
								recipients,
								message: `Event sent to ${data.target}`,
							});
						} else {
							// Broadcast to all subscribed channels
							let totalRecipients = 0;
							for (const channel of socket.data.channels) {
								const recipients = await realTimeService.broadcastToChannel(
									channel,
									data.event,
								);
								totalRecipients += recipients;
							}

							socket.emit("custom_event_result", {
								success: true,
								recipients: totalRecipients,
								message: "Event broadcasted to all channels",
							});
						}
					} catch (error) {
						socket.emit("custom_event_result", {
							success: false,
							error: "Failed to send custom event",
						});
					}
				},
			);

			// Handle ping/pong for connection health
			socket.on("ping", () => {
				socket.emit("pong", { timestamp: Date.now() });
			});

			// Handle disconnection
			socket.on("disconnect", () => {
				const connectionId = this.connectionMap.get(socket.id);
				if (connectionId) {
					realTimeService.disconnect(connectionId);
					this.connectionMap.delete(socket.id);
				}

				console.log(`🔌 Client disconnected: ${socket.id}`);
			});
		});
	}

	/**
	 * Broadcast event to all connected clients
	 */
	broadcastEvent(event: RealTimeEvent, channel?: string): void {
		if (!this.io) return;

		const eventData = {
			event,
			timestamp: new Date().toISOString(),
		};

		if (channel) {
			this.io.to(channel).emit("realtime_event", eventData);
		} else {
			this.io.emit("realtime_event", eventData);
		}
	}

	/**
	 * Send event to specific room
	 */
	sendToRoom(roomName: string, event: RealTimeEvent): void {
		if (!this.io) return;

		this.io.to(roomName).emit("realtime_event", {
			event,
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Send event to specific user
	 */
	sendToUser(userId: string, event: RealTimeEvent): void {
		if (!this.io) return;

		this.io.sockets.sockets.forEach((socket) => {
			if (socket.data?.userId === userId) {
				socket.emit("realtime_event", {
					event,
					timestamp: new Date().toISOString(),
				});
			}
		});
	}

	/**
	 * Get server status
	 */
	getStatus(): {
		isInitialized: boolean;
		connectedClients: number;
		rooms: number;
	} {
		if (!this.io) {
			return {
				isInitialized: false,
				connectedClients: 0,
				rooms: 0,
			};
		}

		return {
			isInitialized: true,
			connectedClients: this.io.engine.clientsCount,
			rooms: Object.keys(this.io.sockets.adapter.rooms).length,
		};
	}

	/**
	 * Shutdown server
	 */
	shutdown(): void {
		if (this.io) {
			this.io.close();
			this.io = null;
		}
		this.isInitialized = false;
		this.connectionMap.clear();
		console.log("🔌 WebSocket Server shutdown");
	}
}

// Export singleton instance
export const webSocketServer = new WebSocketServer();
