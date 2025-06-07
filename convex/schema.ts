import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  chats: defineTable({
    name: v.string(),
    type: v.union(v.literal("direct"), v.literal("group")),
    participants: v.array(v.id("users")),
    createdBy: v.id("users"),
    avatar: v.optional(v.string()),
    lastMessage: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
  })
    .index("by_created_by", ["createdBy"]),

  messages: defineTable({
    chatId: v.id("chats"),
    senderId: v.id("users"),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image")),
    imageId: v.optional(v.id("_storage")),
  })
    .index("by_chat", ["chatId"])
    .index("by_sender", ["senderId"]),

  voiceRooms: defineTable({
    name: v.string(),
    chatId: v.id("chats"),
    isActive: v.boolean(),
    participants: v.array(v.id("users")),
  })
    .index("by_chat", ["chatId"])
    .index("by_active", ["isActive"]),

  dailyRooms: defineTable({
    name: v.string(),
    chatId: v.id("chats"),
    isActive: v.boolean(),
    participants: v.array(v.id("users")),
    dailyRoomUrl: v.string(),
    createdBy: v.id("users"),
  })
    .index("by_chat", ["chatId"])
    .index("by_active", ["isActive"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
