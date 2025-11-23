// Remove any type import - use any for now
import { prisma } from "../prisma/client";
import {
  broadcastEventCreated,
  broadcastEventUpdated,
  broadcastEventDeleted,
  broadcastEventApproved,
} from "../services/websocket.service";

export async function getAllEvents(context: any) {
  try {
    // Check if admin is requesting all events (including unapproved)
    const isAdmin = context.user?.role === "ADMIN";
    const showAll = context.query?.all === "true" || false;

    const events = await prisma.event.findMany({
      where: {
        approved: isAdmin && showAll ? undefined : true, // Admin can see all, others only approved
      },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        rsvps: {
          include: {
            user: {
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
      events,
      count: events.length,
    };
  } catch (error) {
    console.error("Get events error:", error);
    return {
      error: "Failed to fetch events",
      status: 500,
    };
  }
}

// New function to get all events for admin
export async function getAllEventsForAdmin(context: any) {
  try {
    if (!context.user || context.user.role !== "ADMIN") {
      return {
        error: "Unauthorized - Admin access required",
        status: 403,
      };
    }

    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        rsvps: {
          include: {
            user: {
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
      events,
      count: events.length,
    };
  } catch (error) {
    console.error("Get all events error:", error);
    return {
      error: "Failed to fetch events",
      status: 500,
    };
  }
}

export async function getEventById(context: any) {
  try {
    const { id } = context.params as { id: string };

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return {
        error: "Event not found",
        status: 404,
      };
    }

    return {
      event,
    };
  } catch (error) {
    console.error("Get event error:", error);
    return {
      error: "Failed to fetch event",
      status: 500,
    };
  }
}

export async function createEvent(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    // Any authenticated user may submit an event; only ADMINs will be auto-approved

    const { title, description, date, location } = (await context.body) as {
      title: string;
      description: string;
      date: string;
      location: string;
    };

    // Validate input
    if (!title || !description || !date || !location) {
      return { error: "All fields are required", status: 400 };
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        organizerId: context.user.id,
        approved: context.user.role === "ADMIN", // Auto-approve if admin creates
      },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Broadcast to websocket clients
    broadcastEventCreated(event);

    return {
      message: "Event created successfully",
      event,
    };
  } catch (error) {
    console.error("Create event error:", error);
    return {
      error: "Failed to create event",
      status: 500,
    };
  }
}

export async function updateEvent(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    const { id } = context.params as { id: string };

    // Check if user is organizer or admin
    if (context.user.role !== "ORGANIZER" && context.user.role !== "ADMIN") {
      return {
        error: "Only organizers and admins can update events",
        status: 403,
      };
    }

    // Find event
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return {
        error: "Event not found",
        status: 404,
      };
    }

    // Check if user is the organizer or is admin
    if (existingEvent.organizerId !== context.user.id && context.user.role !== "ADMIN") {
      return {
        error: "You can only update your own events",
        status: 403,
      };
    }

    const { title, description, date, location } = (await context.body) as {
      title?: string;
      description?: string;
      date?: string;
      location?: string;
    };

    // Update event
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
      },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Broadcast to websocket clients
    broadcastEventUpdated(event);

    return {
      message: "Event updated successfully",
      event,
    };
  } catch (error) {
    console.error("Update event error:", error);
    return {
      error: "Failed to update event",
      status: 500,
    };
  }
}

export async function deleteEvent(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    const { id } = context.params as { id: string };

    // Check if user is organizer or admin
    if (context.user.role !== "ORGANIZER" && context.user.role !== "ADMIN") {
      return {
        error: "Only organizers and admins can delete events",
        status: 403,
      };
    }

    // Find event
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return {
        error: "Event not found",
        status: 404,
      };
    }

    // Check if user is the organizer or is admin
    if (existingEvent.organizerId !== context.user.id && context.user.role !== "ADMIN") {
      return {
        error: "You can only delete your own events",
        status: 403,
      };
    }

    // Delete event (cascade deletes RSVPs)
    await prisma.event.delete({
      where: { id },
    });

    // Broadcast to websocket clients
    broadcastEventDeleted(id);

    return {
      message: "Event deleted successfully",
    };
  } catch (error) {
    console.error("Delete event error:", error);
    return {
      error: "Failed to delete event",
      status: 500,
    };
  }
}

export async function approveEvent(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    // Check if user is admin
    if (context.user.role !== "ADMIN") {
      return {
        error: "Only admins can approve events",
        status: 403,
      };
    }

    const { id } = context.params as { id: string };

    // Update event
    const event = await prisma.event.update({
      where: { id },
      data: {
        approved: true,
      },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Broadcast to websocket clients
    broadcastEventApproved(event);

    return {
      message: "Event approved successfully",
      event,
    };
  } catch (error) {
    console.error("Approve event error:", error);
    return {
      error: "Failed to approve event",
      status: 500,
    };
  }
}

