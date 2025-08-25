export type TUserEndpoint = {
  id: number;
  name: string;
  last_name: string;
  username: string;
  email: string;
  last_seen: Date | null;
  email_verified_at: Date | null;
  remember_token: string | null;
  createdAt: Date;
  updatedAt: Date;
};
