import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number().int().min(1),
  image: z.string().nullable().optional(),
});

const CreateOrderSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  items: z.array(OrderItemSchema).min(1),
  total: z.string(),
  notes: z.string().optional(),
});

const UpdateStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "completed", "cancelled"]),
});

router.post("/orders", async (req, res) => {
  const parsed = CreateOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }
  const [order] = await db.insert(ordersTable).values({
    customerName: parsed.data.customerName ?? null,
    customerPhone: parsed.data.customerPhone ?? null,
    items: parsed.data.items,
    total: parsed.data.total,
    notes: parsed.data.notes ?? null,
    status: "pending",
  }).returning();
  res.status(201).json(order);
});

router.get("/orders", async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  res.json(orders);
});

router.patch("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateStatusSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid status" }); return; }
  const [updated] = await db.update(ordersTable).set({ status: parsed.data.status }).where(eq(ordersTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(updated);
});

export default router;
