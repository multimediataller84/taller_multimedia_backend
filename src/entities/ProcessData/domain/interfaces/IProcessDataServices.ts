export interface IProcessDataServices {
  updateAll: (file: Express.Multer.File) => Promise<any>;
  processExel: (file: Express.Multer.File) => Promise<any>;
}
