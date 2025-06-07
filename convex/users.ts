import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const users = await ctx.db.query("users").collect();
    return users.filter((user) => user._id !== userId);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

export const createTestUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // Verificar se os usuários de teste já existem
    const existingUsers = await ctx.db.query("users").collect();
    const maiconExists = existingUsers.some(user => user.email === "maicon@test.com");
    const giovanaExists = existingUsers.some(user => user.email === "giovana@test.com");

    const createdUsers = [];

    if (!maiconExists) {
      const maiconId = await ctx.db.insert("users", {
        name: "Maicon",
        email: "maicon@test.com",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isAnonymous: false,
      });
      createdUsers.push({ id: maiconId, name: "Maicon" });
    }

    if (!giovanaExists) {
      const giovanaId = await ctx.db.insert("users", {
        name: "Giovana",
        email: "giovana@test.com",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isAnonymous: false,
      });
      createdUsers.push({ id: giovanaId, name: "Giovana" });
    }

    return {
      message: createdUsers.length > 0 
        ? `Usuários criados: ${createdUsers.map(u => u.name).join(", ")}`
        : "Usuários de teste já existem",
      createdUsers
    };
  },
});
