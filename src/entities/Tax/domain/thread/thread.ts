import { parentPort, workerData } from "worker_threads";
import XLSX from "xlsx";
import { sequelize } from "../../../../database/connection.js";
import Tax from "../models/TaxModel.js";
import { parseBoolean } from "../../utils/parseDouble.js";
import type { TTax } from "../types/TTax.js";

async function procesarExcel(buffer: Buffer): Promise<void> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("excel file does not contain sheets");

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`sheet could not be loaded: ${sheetName}`);

    const rows: TTax[] = XLSX.utils.sheet_to_json(sheet);

    let count = 0;
    const truncatedRows: any[] = [];

    for (const row of rows) {
      let truncated = false;

      let name = String(row.name);
      if (name.length > 512) {
        truncated = true;
        truncatedRows.push({ row, field: "name", original: name });
        name = name.substring(0, 512);
      }

      let description = row.description ? String(row.description) : null;
      if (description && description.length > 512) {
        truncated = true;
        truncatedRows.push({
          row,
          field: "description",
          original: description,
        });
        description = description.substring(0, 512);
      }

      await Tax.upsert({
        name,
        description,
        percentage: parseFloat(String(row.percentage)),
        exempt: parseBoolean(row.exempt),
      });
      
      count++;
    }

    parentPort?.postMessage({ success: true, processed: count });
  } catch (err: any) {
    parentPort?.postMessage({ success: false, error: err.message });
  } finally {
    await sequelize.close();
  }
}

procesarExcel(workerData.buffer);
