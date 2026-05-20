import type { RequestHandler } from "express";

/** Protects admin order routes. Set ADMIN_API_KEY in production. */
export const requireAdmin: RequestHandler = (req, res, next) => {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      res.status(503).json({ error: "Admin API is not configured" });
      return;
    }
    next();
    return;
  }
  const provided = req.header("x-admin-key");
  if (provided !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
