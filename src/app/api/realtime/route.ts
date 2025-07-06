/**
 * Real-time WebSocket API Route
 * مسار WebSocket للوقت الفعلي
 */

import { NextRequest, NextResponse } from "next/server";
import { realTimeService } from "@/odoo-schema-full/real-time-system";

export async function GET(request: NextRequest) {
	try {
		// Initialize real-time service if not already initialized
		await realTimeService.initialize();

		// Get connection status
		const status = realTimeService.getStatus();

		return NextResponse.json({
			success: true,
			message: "Real-time service is running",
			status,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Real-time API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to get real-time status",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { action, data } = body;

		// Initialize real-time service
		await realTimeService.initialize();

		switch (action) {
			case "connect":
				const { sessionId, userId } = data;
				const connection = realTimeService.connect(sessionId, userId);
				return NextResponse.json({
					success: true,
					connection,
					message: "Connected to real-time service",
				});

			case "disconnect":
				const { connectionId } = data;
				const disconnected = realTimeService.disconnect(connectionId);
				return NextResponse.json({
					success: disconnected,
					message: disconnected
						? "Disconnected successfully"
						: "Connection not found",
				});

			case "subscribe":
				const { connectionId: subConnectionId, channelName } = data;
				const subscribed = realTimeService.subscribe(
					subConnectionId,
					channelName,
				);
				return NextResponse.json({
					success: subscribed,
					message: subscribed ? "Subscribed to channel" : "Failed to subscribe",
				});

			case "unsubscribe":
				const {
					connectionId: unsubConnectionId,
					channelName: unsubChannelName,
				} = data;
				const unsubscribed = realTimeService.unsubscribe(
					unsubConnectionId,
					unsubChannelName,
				);
				return NextResponse.json({
					success: unsubscribed,
					message: unsubscribed
						? "Unsubscribed from channel"
						: "Failed to unsubscribe",
				});

			case "broadcast":
				const { channelName: broadcastChannel, event } = data;
				const recipients = await realTimeService.broadcastToChannel(
					broadcastChannel,
					event,
				);
				return NextResponse.json({
					success: true,
					recipients,
					message: `Message broadcasted to ${recipients} recipients`,
				});

			case "send_to_room":
				const { roomName, event: roomEvent } = data;
				const roomRecipients = await realTimeService.sendToRoom(
					roomName,
					roomEvent,
				);
				return NextResponse.json({
					success: true,
					recipients: roomRecipients,
					message: `Message sent to room ${roomName}`,
				});

			case "send_to_users":
				const { userIds, event: userEvent } = data;
				const userRecipients = await realTimeService.sendToUsers(
					userIds,
					userEvent,
				);
				return NextResponse.json({
					success: true,
					recipients: userRecipients,
					message: `Message sent to ${userRecipients} users`,
				});

			case "status":
				const status = realTimeService.getStatus();
				return NextResponse.json({
					success: true,
					status,
				});

			default:
				return NextResponse.json(
					{
						success: false,
						error: "Unknown action",
						supportedActions: [
							"connect",
							"disconnect",
							"subscribe",
							"unsubscribe",
							"broadcast",
							"send_to_room",
							"send_to_users",
							"status",
						],
					},
					{ status: 400 },
				);
		}
	} catch (error) {
		console.error("Real-time API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
