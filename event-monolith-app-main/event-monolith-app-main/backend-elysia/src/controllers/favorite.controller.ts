// Remove any type import - use any for now
import { prisma } from "../prisma/client";

export async function favoriteEvent(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

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

    // Check if already favorited
    const existing = await prisma.eventFavorite.findUnique({
      where: {
        userId_eventId: {
          userId: context.user.id,
          eventId: id,
        },
      },
    });

    if (existing) {
      return {
        error: "Event already in favorites",
        status: 400,
      };
    }

    // Create favorite
    const favorite = await prisma.eventFavorite.create({
      data: {
        userId: context.user.id,
        eventId: id,
      },
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
    });

    return {
      message: "Event added to favorites",
      favorite,
    };
  } catch (error) {
    console.error("Favorite event error:", error);
    return {
      error: "Failed to favorite event",
      status: 500,
    };
  }
}

export async function unfavoriteEvent(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    const { id } = context.params as { id: string };

    // Find and delete favorite
    const favorite = await prisma.eventFavorite.findUnique({
      where: {
        userId_eventId: {
          userId: context.user.id,
          eventId: id,
        },
      },
    });

    if (!favorite) {
      return {
        error: "Event not in favorites",
        status: 404,
      };
    }

    await prisma.eventFavorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return {
      message: "Event removed from favorites",
    };
  } catch (error) {
    console.error("Unfavorite event error:", error);
    return {
      error: "Failed to unfavorite event",
      status: 500,
    };
  }
}

export async function getUserFavorites(context: any) {
  try {
    if (!context.user) {
      return { error: "Unauthorized", status: 401 };
    }

    const favorites = await prisma.eventFavorite.findMany({
      where: { userId: context.user.id },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
            rsvps: {
              select: {
                id: true,
                status: true,
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
      favorites,
      count: favorites.length,
    };
  } catch (error) {
    console.error("Get favorites error:", error);
    return {
      error: "Failed to fetch favorites",
      status: 500,
    };
  }
}

