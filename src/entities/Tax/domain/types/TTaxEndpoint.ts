export type TTaxEndpoint = {
  id: number;
  name: string;
  category: string | null;
  status: string | null;
  percentage: number;
  exempt: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
