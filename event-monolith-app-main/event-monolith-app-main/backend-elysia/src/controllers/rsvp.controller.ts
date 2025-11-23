// Remove any type import - use any for now
import { prisma } from "../prisma/client";
import {
  broadcastRSVPAdded,
  broadcastRSVPUpdated,
} from "../services/websocket.service";

export async function rsvpToEvent(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    const { id } = context.params as { id: string };
    const { status } = (await context.body) as {
      status: "GOING" | "MAYBE" | "NOT_GOING";
    };

    // Validate status
    if (!["GOING", "MAYBE", "NOT_GOING"].includes(status)) {
      return {
        error: "Invalid RSVP status",
        status: 400,
      };
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return {
        error: "Event not found",
        status: 404,
      };
    }

    // Check if event is approved
    if (!event.approved) {
      return {
        error: "Event is not approved yet",
        status: 400,
      };
    }

    // Create or update RSVP
    const rsvp = await prisma.rSVP.upsert({
      where: {
        userId_eventId: {
          userId: context.user.id,
          eventId: id,
        },
      },
      update: {
        status,
      },
      create: {
        userId: context.user.id,
        eventId: id,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Broadcast to websocket clients
    if (rsvp.createdAt === rsvp.updatedAt) {
      // New RSVP
      broadcastRSVPAdded(rsvp);
    } else {
      // Updated RSVP
      broadcastRSVPUpdated(rsvp);
    }

    return {
      message: "RSVP updated successfully",
      rsvp,
    };
  } catch (error) {
    console.error("RSVP error:", error);
    return {
      error: "Failed to RSVP",
      status: 500,
    };
  }
}

export async function getEventRSVPs(context: any) {
  try {
    const { id } = context.params as { id: string };

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return {
        error: "Event not found",
        status: 404,
      };
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { eventId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      rsvps,
      count: rsvps.length,
    };
  } catch (error) {
    console.error("Get RSVPs error:", error);
    return {
      error: "Failed to fetch RSVPs",
      status: 500,
    };
  }
}

export async function getUserRSVPs(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { userId: context.user.id },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      rsvps,
      count: rsvps.length,
    };
  } catch (error) {
    console.error("Get user RSVPs error:", error);
    return {
      error: "Failed to fetch your RSVPs",
      status: 500,
    };
  }
}

