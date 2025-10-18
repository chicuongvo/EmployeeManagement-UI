interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export const signIn = async ({
  email,
  password,
}: SignInParams): Promise<void> => {};

export const signUp = async ({
  name,
  email,
  password,
}: SignUpParams): Promise<void> => {};
