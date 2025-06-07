import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image")),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user is participant
    const chat = await ctx.db.get(args.chatId);
    if (!chat || !chat.participants.includes(userId)) {
      throw new Error("Not authorized to send messages to this chat");
    }

    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      senderId: userId,
      content: args.content,
      type: args.type,
      imageId: args.imageId,
    });

    // Update chat's last message
    await ctx.db.patch(args.chatId, {
      lastMessage: args.content,
      lastMessageTime: Date.now(),
    });

    return messageId;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.storage.generateUploadUrl();
  },
});
