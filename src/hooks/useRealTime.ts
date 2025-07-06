/**
 * Real-time React Hook
 * Hook للتعامل مع نظام الوقت الفعلي
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { RealTimeEvent } from "@/odoo-schema-full/real-time-system";

export interface RealTimeConnection {
	isConnected: boolean;
	isAuthenticated: boolean;
	connectionId?: string;
	userId?: string;
	sessionId?: string;
	channels: string[];
	rooms: string[];
}

export interface RealTimeMessage {
	event: RealTimeEvent;
	timestamp: string;
}

export interface UseRealTimeOptions {
	autoConnect?: boolean;
	autoAuthenticate?: boolean;
	userId?: string;
	sessionId?: string;
	channels?: string[];
	rooms?: string[];
	onConnect?: (connection: RealTimeConnection) => void;
	onDisconnect?: () => void;
	onAuthenticated?: (connection: RealTimeConnection) => void;
	onEvent?: (message: RealTimeMessage) => void;
	onError?: (error: any) => void;
}

export interface UseRealTimeReturn {
	// Connection state
	connection: RealTimeConnection;

	// Connection methods
	connect: () => void;
	disconnect: () => void;
	authenticate: (userId: string, sessionId: string) => Promise<boolean>;

	// Channel methods
	subscribe: (channelName: string) => Promise<boolean>;
	unsubscribe: (channelName: string) => Promise<boolean>;

	// Room methods
	joinRoom: (roomName: string) => Promise<boolean>;
	leaveRoom: (roomName: string) => Promise<boolean>;

	// Event methods
	sendEvent: (event: RealTimeEvent, target?: string) => Promise<boolean>;
	broadcastEvent: (
		event: RealTimeEvent,
		channelName: string,
	) => Promise<boolean>;

	// Utility methods
	ping: () => void;
	getStatus: () => { isConnected: boolean; isAuthenticated: boolean };
}

export function useRealTime(
	options: UseRealTimeOptions = {},
): UseRealTimeReturn {
	const {
		autoConnect = true,
		autoAuthenticate = false,
		userId,
		sessionId,
		channels = [],
		rooms = [],
		onConnect,
		onDisconnect,
		onAuthenticated,
		onEvent,
		onError,
	} = options;

	const socketRef = useRef<Socket | null>(null);
	const [connection, setConnection] = useState<RealTimeConnection>({
		isConnected: false,
		isAuthenticated: false,
		channels: [],
		rooms: [],
	});

	// Initialize socket connection
	const initializeSocket = useCallback(() => {
		if (socketRef.current) {
			return;
		}

		const socketUrl =
			process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000";

		socketRef.current = io(socketUrl, {
			transports: ["websocket", "polling"],
			autoConnect: false,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});

		// Setup event listeners
		socketRef.current.on("connect", () => {
			console.log("🔗 WebSocket connected");
			setConnection((prev) => ({
				...prev,
				isConnected: true,
			}));
			onConnect?.(connection);
		});

		socketRef.current.on("disconnect", () => {
			console.log("🔌 WebSocket disconnected");
			setConnection((prev) => ({
				...prev,
				isConnected: false,
				isAuthenticated: false,
			}));
			onDisconnect?.();
		});

		socketRef.current.on(
			"authenticated",
			(data: { success: boolean; connectionId?: string; error?: string }) => {
				if (data.success) {
					console.log("✅ WebSocket authenticated");
					setConnection((prev) => ({
						...prev,
						isAuthenticated: true,
						connectionId: data.connectionId,
					}));
					onAuthenticated?.(connection);
				} else {
					console.error("❌ WebSocket authentication failed:", data.error);
					onError?.(new Error(data.error));
				}
			},
		);

		socketRef.current.on(
			"subscription_result",
			(data: { success: boolean; channelName?: string; error?: string }) => {
				if (data.success && data.channelName) {
					setConnection((prev) => ({
						...prev,
						channels: [...prev.channels, data.channelName!],
					}));
					console.log(`📡 Subscribed to channel: ${data.channelName}`);
				} else {
					console.error("❌ Subscription failed:", data.error);
					onError?.(new Error(data.error));
				}
			},
		);

		socketRef.current.on(
			"unsubscription_result",
			(data: { success: boolean; channelName?: string; error?: string }) => {
				if (data.success && data.channelName) {
					setConnection((prev) => ({
						...prev,
						channels: prev.channels.filter((ch) => ch !== data.channelName),
					}));
					console.log(`📡 Unsubscribed from channel: ${data.channelName}`);
				} else {
					console.error("❌ Unsubscription failed:", data.error);
					onError?.(new Error(data.error));
				}
			},
		);

		socketRef.current.on(
			"room_result",
			(data: {
				success: boolean;
				roomName?: string;
				action?: string;
				error?: string;
			}) => {
				if (data.success && data.roomName) {
					if (data.action === "joined") {
						setConnection((prev) => ({
							...prev,
							rooms: [...prev.rooms, data.roomName!],
						}));
						console.log(`🏠 Joined room: ${data.roomName}`);
					} else if (data.action === "left") {
						setConnection((prev) => ({
							...prev,
							rooms: prev.rooms.filter((room) => room !== data.roomName),
						}));
						console.log(`🏠 Left room: ${data.roomName}`);
					}
				} else {
					console.error("❌ Room operation failed:", data.error);
					onError?.(new Error(data.error));
				}
			},
		);

		socketRef.current.on("realtime_event", (message: RealTimeMessage) => {
			console.log("📨 Received real-time event:", message);
			onEvent?.(message);
		});

		socketRef.current.on("pong", (data: { timestamp: number }) => {
			console.log("🏓 Pong received:", data.timestamp);
		});

		socketRef.current.on("connect_error", (error) => {
			console.error("❌ WebSocket connection error:", error);
			onError?.(error);
		});

		socketRef.current.on("error", (error) => {
			console.error("❌ WebSocket error:", error);
			onError?.(error);
		});
	}, [onConnect, onDisconnect, onAuthenticated, onEvent, onError, connection]);

	// Connect to WebSocket
	const connect = useCallback(() => {
		if (!socketRef.current) {
			initializeSocket();
		}
		socketRef.current?.connect();
	}, [initializeSocket]);

	// Disconnect from WebSocket
	const disconnect = useCallback(() => {
		socketRef.current?.disconnect();
	}, []);

	// Authenticate with WebSocket
	const authenticate = useCallback(
		async (userId: string, sessionId: string): Promise<boolean> => {
			return new Promise((resolve) => {
				if (!socketRef.current?.connected) {
					resolve(false);
					return;
				}

				socketRef.current.emit("authenticate", { userId, sessionId });

				// Listen for authentication result
				const handleAuthenticated = (data: { success: boolean }) => {
					socketRef.current?.off("authenticated", handleAuthenticated);
					resolve(data.success);
				};

				socketRef.current.on("authenticated", handleAuthenticated);

				// Timeout after 5 seconds
				setTimeout(() => {
					socketRef.current?.off("authenticated", handleAuthenticated);
					resolve(false);
				}, 5000);
			});
		},
		[],
	);

	// Subscribe to channel
	const subscribe = useCallback(
		async (channelName: string): Promise<boolean> => {
			return new Promise((resolve) => {
				if (!socketRef.current?.connected || !connection.isAuthenticated) {
					resolve(false);
					return;
				}

				socketRef.current.emit("subscribe", { channelName });

				const handleResult = (data: { success: boolean }) => {
					socketRef.current?.off("subscription_result", handleResult);
					resolve(data.success);
				};

				socketRef.current.on("subscription_result", handleResult);

				setTimeout(() => {
					socketRef.current?.off("subscription_result", handleResult);
					resolve(false);
				}, 5000);
			});
		},
		[connection.isAuthenticated],
	);

	// Unsubscribe from channel
	const unsubscribe = useCallback(
		async (channelName: string): Promise<boolean> => {
			return new Promise((resolve) => {
				if (!socketRef.current?.connected || !connection.isAuthenticated) {
					resolve(false);
					return;
				}

				socketRef.current.emit("unsubscribe", { channelName });

				const handleResult = (data: { success: boolean }) => {
					socketRef.current?.off("unsubscription_result", handleResult);
					resolve(data.success);
				};

				socketRef.current.on("unsubscription_result", handleResult);

				setTimeout(() => {
					socketRef.current?.off("unsubscription_result", handleResult);
					resolve(false);
				}, 5000);
			});
		},
		[connection.isAuthenticated],
	);

	// Join room
	const joinRoom = useCallback(
		async (roomName: string): Promise<boolean> => {
			return new Promise((resolve) => {
				if (!socketRef.current?.connected || !connection.isAuthenticated) {
					resolve(false);
					return;
				}

				socketRef.current.emit("join_room", { roomName });

				const handleResult = (data: { success: boolean; action?: string }) => {
					socketRef.current?.off("room_result", handleResult);
					resolve(data.success && data.action === "joined");
				};

				socketRef.current.on("room_result", handleResult);

				setTimeout(() => {
					socketRef.current?.off("room_result", handleResult);
					resolve(false);
				}, 5000);
			});
		},
		[connection.isAuthenticated],
	);

	// Leave room
	const leaveRoom = useCallback(
		async (roomName: string): Promise<boolean> => {
			return new Promise((resolve) => {
				if (!socketRef.current?.connected || !connection.isAuthenticated) {
					resolve(false);
					return;
				}

				socketRef.current.emit("leave_room", { roomName });

				const handleResult = (data: { success: boolean; action?: string }) => {
					socketRef.current?.off("room_result", handleResult);
					resolve(data.success && data.action === "left");
				};

				socketRef.current.on("room_result", handleResult);

				setTimeout(() => {
					socketRef.current?.off("room_result", handleResult);
					resolve(false);
				}, 5000);
			});
		},
		[connection.isAuthenticated],
	);

	// Send custom event
	const sendEvent = useCallback(
		async (event: RealTimeEvent, target?: string): Promise<boolean> => {
			return new Promise((resolve) => {
				if (!socketRef.current?.connected || !connection.isAuthenticated) {
					resolve(false);
					return;
				}

				socketRef.current.emit("custom_event", { event, target });

				const handleResult = (data: { success: boolean }) => {
					socketRef.current?.off("custom_event_result", handleResult);
					resolve(data.success);
				};

				socketRef.current.on("custom_event_result", handleResult);

				setTimeout(() => {
					socketRef.current?.off("custom_event_result", handleResult);
					resolve(false);
				}, 5000);
			});
		},
		[connection.isAuthenticated],
	);

	// Broadcast event to channel
	const broadcastEvent = useCallback(
		async (event: RealTimeEvent, channelName: string): Promise<boolean> => {
			return sendEvent(event, channelName);
		},
		[sendEvent],
	);

	// Ping server
	const ping = useCallback(() => {
		socketRef.current?.emit("ping");
	}, []);

	// Get connection status
	const getStatus = useCallback(
		() => ({
			isConnected: connection.isConnected,
			isAuthenticated: connection.isAuthenticated,
		}),
		[connection.isConnected, connection.isAuthenticated],
	);

	// Auto-connect and authenticate
	useEffect(() => {
		if (autoConnect) {
			connect();
		}

		return () => {
			disconnect();
		};
	}, [autoConnect, connect, disconnect]);

	// Auto-authenticate
	useEffect(() => {
		if (
			autoAuthenticate &&
			userId &&
			sessionId &&
			connection.isConnected &&
			!connection.isAuthenticated
		) {
			authenticate(userId, sessionId);
		}
	}, [
		autoAuthenticate,
		userId,
		sessionId,
		connection.isConnected,
		connection.isAuthenticated,
		authenticate,
	]);

	// Auto-subscribe to channels
	useEffect(() => {
		if (connection.isAuthenticated && channels.length > 0) {
			channels.forEach((channel) => {
				if (!connection.channels.includes(channel)) {
					subscribe(channel);
				}
			});
		}
	}, [connection.isAuthenticated, channels, connection.channels, subscribe]);

	// Auto-join rooms
	useEffect(() => {
		if (connection.isAuthenticated && rooms.length > 0) {
			rooms.forEach((room) => {
				if (!connection.rooms.includes(room)) {
					joinRoom(room);
				}
			});
		}
	}, [connection.isAuthenticated, rooms, connection.rooms, joinRoom]);

	return {
		connection,
		connect,
		disconnect,
		authenticate,
		subscribe,
		unsubscribe,
		joinRoom,
		leaveRoom,
		sendEvent,
		broadcastEvent,
		ping,
		getStatus,
	};
}
