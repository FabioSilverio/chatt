import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createVoiceRoom = mutation({
  args: {
    chatId: v.id("chats"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user is participant in the chat
    const chat = await ctx.db.get(args.chatId);
    if (!chat || !chat.participants.includes(userId)) {
      throw new Error("Not authorized");
    }

    const roomId = await ctx.db.insert("voiceRooms", {
      name: args.name,
      chatId: args.chatId,
      isActive: true,
      participants: [userId],
    });

    return roomId;
  },
});

export const joinVoiceRoom = mutation({
  args: {
    roomId: v.id("voiceRooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    if (!room.participants.includes(userId)) {
      await ctx.db.patch(args.roomId, {
        participants: [...room.participants, userId],
      });
    }

    return room;
  },
});

export const leaveVoiceRoom = mutation({
  args: {
    roomId: v.id("voiceRooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

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

export const getActiveVoiceRooms = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const rooms = await ctx.db
      .query("voiceRooms")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return rooms;
  },
});
