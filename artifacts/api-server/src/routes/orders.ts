import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "../middleware/adminAuth";

const router: IRouter = Router();

const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number().int().min(1),
  image: z.string().nullable().optional(),
});

const CreateOrderSchema = z.object({
  customerName: z.string().max(200).optional(),
  customerPhone: z.string().max(50).optional(),
  items: z.array(OrderItemSchema).min(1),
  total: z.string().max(32),
  notes: z.string().max(2000).optional(),
});

const UpdateStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "completed", "cancelled"]),
});

router.post("/orders", async (req, res, next) => {
  try {
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
      return;
    }
    const [order] = await db
      .insert(ordersTable)
      .values({
        customerName: parsed.data.customerName ?? null,
        customerPhone: parsed.data.customerPhone ?? null,
        items: parsed.data.items,
        total: parsed.data.total,
        notes: parsed.data.notes ?? null,
        status: "pending",
      })
      .returning();
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get("/orders", requireAdmin, async (_req, res, next) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.patch("/orders/:id", requireAdmin, async (req, res, next) => {
  try {
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = UpdateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid status", details: parsed.error.issues });
      return;
    }
    const [updated] = await db
      .update(ordersTable)
      .set({ status: parsed.data.status })
      .where(eq(ordersTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
