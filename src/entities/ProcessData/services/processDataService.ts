import path from "path";
import type { IProcessDataServices } from "../domain/interfaces/IProcessDataServices.js";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProcessDataService implements IProcessDataServices {
  private static instance: ProcessDataService;

  public static getInstance(): ProcessDataService {
    if (!ProcessDataService.instance) {
      ProcessDataService.instance = new ProcessDataService();
    }
    return ProcessDataService.instance;
  }

  updateAll = async (file: Express.Multer.File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve(__dirname, "../domain/thread/processUpdateExcel.js"),
        { workerData: { buffer: file.buffer, filename: file.originalname } }
      );

      worker.on("message", (msg) => {
        if (msg.success) resolve(msg);
        else reject(new Error(msg.error));
      });

      worker.on("error", (err) => reject(err));
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`worker exited with code ${code}`));
      });
    });
  };
}
