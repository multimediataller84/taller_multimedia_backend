export type TTax = {
  name: string;
  percentage: number;
  category: string | null;
  status: string | null;
  exempt: boolean;
  description: string | null;
};
