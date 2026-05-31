export type Profile = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  created_at: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = SignInInput & {
  name?: string;
};
