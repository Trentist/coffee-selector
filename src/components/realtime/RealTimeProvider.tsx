"use client";

/**
 * Real-time Provider Component
 * مكون مزود الوقت الفعلي
 */

import React, { createContext, useContext, useState } from "react";
import {
	useRealTime,
	RealTimeConnection,
	RealTimeMessage,
} from "@/hooks/useRealTime";

interface RealTimeContextType {
	connection: RealTimeConnection;
	connect: () => void;
	disconnect: () => void;
	authenticate: (userId: string, sessionId: string) => Promise<boolean>;
	subscribe: (channelName: string) => Promise<boolean>;
	unsubscribe: (channelName: string) => Promise<boolean>;
	joinRoom: (roomName: string) => Promise<boolean>;
	leaveRoom: (roomName: string) => Promise<boolean>;
	sendEvent: (event: any, target?: string) => Promise<boolean>;
	broadcastEvent: (event: any, channelName: string) => Promise<boolean>;
	ping: () => void;
	getStatus: () => { isConnected: boolean; isAuthenticated: boolean };
	lastMessage?: RealTimeMessage;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(
	undefined,
);

interface RealTimeProviderProps {
	children: React.ReactNode;
	userId?: string;
	sessionId?: string;
	channels?: string[];
	rooms?: string[];
	autoConnect?: boolean;
	autoAuthenticate?: boolean;
	onConnect?: (connection: RealTimeConnection) => void;
	onDisconnect?: () => void;
	onAuthenticated?: (connection: RealTimeConnection) => void;
	onEvent?: (message: RealTimeMessage) => void;
	onError?: (error: any) => void;
}

export function RealTimeProvider({
	children,
	userId,
	sessionId,
	channels = [],
	rooms = [],
	autoConnect = true,
	autoAuthenticate = false,
	onConnect,
	onDisconnect,
	onAuthenticated,
	onEvent,
	onError,
}: RealTimeProviderProps) {
	const [lastMessage, setLastMessage] = useState<RealTimeMessage>();

	const realTime = useRealTime({
		autoConnect,
		autoAuthenticate,
		userId,
		sessionId,
		channels,
		rooms,
		onConnect,
		onDisconnect,
		onAuthenticated,
		onEvent: (message) => {
			setLastMessage(message);
			onEvent?.(message);
		},
		onError,
	});

	const contextValue: RealTimeContextType = {
		...realTime,
		lastMessage,
	};

	return (
		<RealTimeContext.Provider value={contextValue}>
			{children}
		</RealTimeContext.Provider>
	);
}

export function useRealTimeContext(): RealTimeContextType {
	const context = useContext(RealTimeContext);
	if (context === undefined) {
		throw new Error(
			"useRealTimeContext must be used within a RealTimeProvider",
		);
	}
	return context;
}

// Hook for specific real-time features
export function useRealTimeEvents() {
	const { lastMessage, onEvent } = useRealTimeContext();
	return { lastMessage, onEvent };
}

export function useRealTimeConnection() {
	const { connection, connect, disconnect, authenticate, getStatus } =
		useRealTimeContext();
	return { connection, connect, disconnect, authenticate, getStatus };
}

export function useRealTimeChannels() {
	const { subscribe, unsubscribe, connection } = useRealTimeContext();
	return { subscribe, unsubscribe, channels: connection.channels };
}

export function useRealTimeRooms() {
	const { joinRoom, leaveRoom, connection } = useRealTimeContext();
	return { joinRoom, leaveRoom, rooms: connection.rooms };
}

export default RealTimeProvider;
