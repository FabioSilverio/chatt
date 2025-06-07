import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listUserChats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const allChats = await ctx.db.query("chats").collect();
    const chats = allChats.filter(chat => chat.participants.includes(userId));

    // Get chat details with participant info
    const chatsWithDetails = await Promise.all(
      chats.map(async (chat) => {
        const participants = await Promise.all(
          chat.participants.map(async (participantId) => {
            const user = await ctx.db.get(participantId);
            return user;
          })
        );

        const lastMessage = chat.lastMessage
          ? await ctx.db
              .query("messages")
              .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
              .order("desc")
              .first()
          : null;

        return {
          ...chat,
          participants: participants.filter(Boolean),
          lastMessage,
        };
      })
    );

    return chatsWithDetails;
  },
});

export const createDirectChat = mutation({
  args: {
    participantId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if direct chat already exists
    const allChats = await ctx.db.query("chats").collect();
    const existingChat = allChats.find(chat => 
      chat.type === "direct" && 
      chat.participants.length === 2 &&
      chat.participants.includes(userId) && 
      chat.participants.includes(args.participantId)
    );

    if (existingChat) {
      return existingChat._id;
    }

    const participant = await ctx.db.get(args.participantId);
    if (!participant) throw new Error("User not found");

    const chatId = await ctx.db.insert("chats", {
      name: participant.name || participant.email || "Direct Chat",
      type: "direct",
      participants: [userId, args.participantId],
      createdBy: userId,
    });

    return chatId;
  },
});

export const createGroupChat = mutation({
  args: {
    name: v.string(),
    participantIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const participants = [userId, ...args.participantIds];

    const chatId = await ctx.db.insert("chats", {
      name: args.name,
      type: "group",
      participants,
      createdBy: userId,
    });

    return chatId;
  },
});

export const getChatMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify user is participant
    const chat = await ctx.db.get(args.chatId);
    if (!chat || !chat.participants.includes(userId)) {
      throw new Error("Not authorized to view this chat");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    // Get sender info and image URLs
    const messagesWithDetails = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        const imageUrl = message.imageId
          ? await ctx.storage.getUrl(message.imageId)
          : null;

        return {
          ...message,
          sender,
          imageUrl,
        };
      })
    );

    return messagesWithDetails;
  },
});
