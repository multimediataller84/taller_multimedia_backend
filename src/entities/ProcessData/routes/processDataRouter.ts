import express from "express";
import multer from "multer";
import { ProcessDataController } from "../controllers/processDataController.js";

const processDataController = ProcessDataController.getInstance();
const processDataRouter = express.Router();
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * @openapi
 * /tax/update/all:
 *   patch:
 *     summary: Update all taxes using an Excel file
 *     description: Only administrators can upload an Excel file to update the tax table in batches.
 *     tags:
 *       - Tax
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Update successful.
 *       400:
 *         description: Missing or invalid file.
 *       401:
 *         description: Unauthorized (admin role required).
 *       404:
 *         description: Error in processing.
 */
processDataRouter.patch("/update/all", upload.single("file"), processDataController.updateAll);

export default processDataRouter;
