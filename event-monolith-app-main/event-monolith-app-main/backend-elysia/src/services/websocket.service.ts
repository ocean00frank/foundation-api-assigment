import type { ServerWebSocket } from "bun";

interface WSData {
  userId?: string;
  email?: string;
}

type EventType = "event_created" | "event_updated" | "event_deleted" | "event_approved" | "rsvp_added" | "rsvp_updated";

interface WSMessage {
  type: EventType;
  data: any;
}

const connectedClients = new Map<string, ServerWebSocket<WSData>>();

export function addClient(socketId: string, ws: ServerWebSocket<WSData>) {
  connectedClients.set(socketId, ws);
  console.log(`Client connected: ${socketId}. Total: ${connectedClients.size}`);
}

export function removeClient(socketId: string) {
  connectedClients.delete(socketId);
  console.log(`Client disconnected: ${socketId}. Total: ${connectedClients.size}`);
}

export function broadcastMessage(message: WSMessage) {
  const messageString = JSON.stringify(message);
  let broadcastCount = 0;

  connectedClients.forEach((ws) => {
    try {
      ws.send(messageString);
      broadcastCount++;
    } catch (error) {
      console.error("Error sending message to client:", error);
    }
  });

  console.log(`Broadcasted message to ${broadcastCount} clients`);
}

export function broadcastEventCreated(event: any) {
  broadcastMessage({
    type: "event_created",
    data: event,
  });
}

export function broadcastEventUpdated(event: any) {
  broadcastMessage({
    type: "event_updated",
    data: event,
  });
}

export function broadcastEventDeleted(eventId: string) {
  broadcastMessage({
    type: "event_deleted",
    data: { id: eventId },
  });
}

export function broadcastEventApproved(event: any) {
  broadcastMessage({
    type: "event_approved",
    data: event,
  });
}

export function broadcastRSVPAdded(rsvp: any) {
  broadcastMessage({
    type: "rsvp_added",
    data: rsvp,
  });
}

export function broadcastRSVPUpdated(rsvp: any) {
  broadcastMessage({
    type: "rsvp_updated",
    data: rsvp,
  });
}

export function getConnectedClientCount() {
  return connectedClients.size;
}

