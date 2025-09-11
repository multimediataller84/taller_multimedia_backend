export interface IProcessDataRepository {
  updateAll: (file: Express.Multer.File) => Promise<any>;
}
