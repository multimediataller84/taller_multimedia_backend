export interface IProcessDataServices {
  updateAll: (file: Express.Multer.File) => Promise<any>;
}
