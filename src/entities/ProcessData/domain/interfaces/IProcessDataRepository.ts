export interface IProcessDataRepository {
  updateAll: (file: Express.Multer.File) => Promise<any>;
  processExel: (file: Express.Multer.File) => Promise<any>;
}
