import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";

import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { createUploadUrl } from "../s3.js";

export const uploadsRouter = Router();

const uploadSchema = z.object({
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp"
  ])
});

uploadsRouter.post(
  "/presign",
  requireAuth,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { contentType } = uploadSchema.parse(req.body);

      const extension =
        contentType === "image/png"
          ? "png"
          : contentType === "image/webp"
            ? "webp"
            : "jpg";

      const imageKey =
        `events/${randomUUID()}.${extension}`;

      const uploadUrl =
        await createUploadUrl(imageKey, contentType);

      res.json({
        uploadUrl,
        imageKey
      });
    } catch (error) {
      next(error);
    }
  }
);