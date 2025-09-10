export type TTaxEndpoint = {
  id: number;
  name: string;
  percentage: number;
  exempt: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
