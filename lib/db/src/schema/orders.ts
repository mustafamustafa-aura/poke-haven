import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number().int().min(1),
  image: z.string().nullable().optional(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  items: jsonb("items").notNull().$type<OrderItem[]>(),
  total: text("total").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export const selectOrderSchema = createSelectSchema(ordersTable);

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
