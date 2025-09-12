import path from "path";
import type { IProcessDataServices } from "../domain/interfaces/IProcessDataServices.js";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import type { TStatus } from "../domain/types/TStatus.js";
import { config } from "../../../utilities/config.js";
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

  processExel = async (file: Express.Multer.File): Promise<TStatus> => {
    try {
      const formData = new FormData();
      formData.append("file", file.buffer, file.originalname);

      const response = await axios.post<TStatus>(
        `${config.PY_API}/api/process/excel`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      return response.data
      
    } catch (e) {
      throw new Error("error at " + e);
    }
  };
}
