import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createDailyRoomWithAPI = action({
  args: {
    chatId: v.id("chats"),
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Use environment variable for API key
      const apiKey = process.env.DAILY_API_KEY;
      if (!apiKey) {
        console.warn("Daily.co API key not configured, using fallback URL");
        return { roomUrl: `https://your-domain.daily.co/${args.roomName}` };
      }

      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: args.roomName,
          properties: {
            max_participants: 10,
            enable_screenshare: true,
            enable_chat: true,
            start_video_off: false,
            start_audio_off: false,
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
          },
        }),
      });

      if (!response.ok) {
        console.error("Failed to create Daily.co room:", await response.text());
        return { roomUrl: `https://your-domain.daily.co/${args.roomName}` };
      }

      const roomData = await response.json();
      return { roomUrl: roomData.url };
    } catch (error) {
      console.error("Error creating Daily.co room:", error);
      return { roomUrl: `https://your-domain.daily.co/${args.roomName}` };
    }
  },
});

export const createDailyRoom = mutation({
  args: {
    chatId: v.id("chats"),
    roomName: v.string(),
    roomUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Não autenticado");

    const chat = await ctx.db.get(args.chatId);
    if (!chat || !chat.participants.includes(userId)) {
      throw new Error("Não autorizado");
    }

    const roomId = await ctx.db.insert("dailyRooms", {
      name: args.roomName,
      chatId: args.chatId,
      isActive: true,
      participants: [userId],
      dailyRoomUrl: args.roomUrl,
      createdBy: userId,
    });

    return roomId;
  },
});

export const joinDailyRoom = mutation({
  args: {
    roomId: v.id("dailyRooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Não autenticado");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Sala não encontrada");

    if (!room.participants.includes(userId)) {
      await ctx.db.patch(args.roomId, {
        participants: [...room.participants, userId],
      });
    }

    return room;
  },
});

export const leaveDailyRoom = mutation({
  args: {
    roomId: v.id("dailyRooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Não autenticado");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Sala não encontrada");

    const updatedParticipants = room.participants.filter((id) => id !== userId);

    if (updatedParticipants.length === 0) {
      await ctx.db.patch(args.roomId, { isActive: false });
    } else {
      await ctx.db.patch(args.roomId, {
        participants: updatedParticipants,
      });
    }

    return room;
  },
});

export const getActiveDailyRooms = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const rooms = await ctx.db
      .query("dailyRooms")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return rooms;
  },
});
