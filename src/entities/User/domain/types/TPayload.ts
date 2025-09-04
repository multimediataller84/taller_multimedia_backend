export type TPayload = {
  user: {
    id: number;
    email: string;
    username: string;
    role?: { name: string; description: string };
  };
  token: string;
};
