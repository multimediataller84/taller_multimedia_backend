export type TPayload = {
  user: {
    id: number;
    email: string | null;
    username: string;
    role?: { name: string; description: string };
  };
  token: string;
};
