export type ROLE = "ADMIN" | "USER";

export type SignInData = {
  email: string;
  password: string;
};

export type UpdateUserRequest = Partial<Pick<UserResponse, "name" | "email">>;

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  role: ROLE;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};
